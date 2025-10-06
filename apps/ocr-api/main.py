#!/usr/bin/env python3
"""
Minimal FastAPI OCR backend (stubbed processing) for CaiZen mockup integration.
Provides upload → process (background) → results endpoints with a stable shape
that matches the frontend's SmartOCRParser expectations.

NOTE: Replace the stubbed extraction with real OCR/classification later.
"""

from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import os
import shutil
import uuid
import sys
import re
import time

app = FastAPI(title="CaiZen OCR API", version="0.1.0")

# CORS: in dev allow all; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data", "uploads")
os.makedirs(DATA_DIR, exist_ok=True)

# Optional external scripts root (local prototype). If available, we will use
# real OCR + parsing; otherwise we fall back to a stubbed result.
SCRIPTS_ROOT = os.environ.get(
    "CAIZEN_OCR_SCRIPTS_ROOT",
    "/Users/marcusanderssondipace/Library/Mobile Documents/com~apple~CloudDocs/BMW 118i_CAH643_WBAUM11070VH69821",
)
_HAS_EXTERNAL = False
try:
    if os.path.isdir(SCRIPTS_ROOT):
        sys.path.insert(0, SCRIPTS_ROOT)
        from scripts.classify_documents import ensure_ocr_text_exists  # type: ignore
        from scripts.parse_inspection_and_import import build_inspection_from_file  # type: ignore

        _HAS_EXTERNAL = True
except Exception:
    _HAS_EXTERNAL = False


class ProcessingResult(BaseModel):
    task_id: str
    status: str  # pending, processing, completed, failed
    document_type: Optional[str] = None
    confidence: Optional[float] = None
    extracted_data: Optional[Dict[str, Any]] = None
    manual_review_needed: Optional[bool] = None


tasks: Dict[str, Dict[str, Any]] = {}


@app.get("/")
async def root():
    return {
        "message": "CaiZen OCR API",
        "endpoints": {
            "upload": "/api/upload",
            "status": "/api/process/{task_id}",
            "results": "/api/results/{task_id}",
        },
    }


@app.post("/api/upload")
async def upload(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="Missing file")

    task_id = str(uuid.uuid4())
    task_dir = os.path.join(DATA_DIR, task_id)
    os.makedirs(task_dir, exist_ok=True)
    file_path = os.path.join(task_dir, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    tasks[task_id] = {
        "status": "pending",
        "file_path": file_path,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    background_tasks.add_task(_process_task, task_id)
    return {"task_id": task_id, "status": "pending"}


def _process_task(task_id: str) -> None:
    try:
        task = tasks.get(task_id)
        if not task:
            return
        task["status"] = "processing"

        started = time.time()
        filename = os.path.basename(task["file_path"]) or "document"

        if _HAS_EXTERNAL:
            # 1) Ensure OCR text exists (written under scripts' ROOT/ocr)
            try:
                ensure_ocr_text_exists(task["file_path"])  # type: ignore
            except Exception:
                pass
            # 2) Build structured inspection data from image file
            separated = _build_separated_from_external(task["file_path"], filename)
            doc_type = "inspection_protocol" if separated.get("vehicleData", {}).get("inspectionResult") else "unknown"
            conf = float(separated.get("vehicleData", {}).get("confidence") or 0)
        else:
            # Fallback stub
            separated = _stub_separated(filename)
            doc_type = "unknown"
            conf = 0.0

        elapsed = max(0.1, time.time() - started)
        if "metadata" in separated:
            separated["metadata"]["processingTime"] = f"{elapsed:.1f}s"

        task.update(
            {
                "status": "completed",
                "document_type": doc_type,
                "confidence": conf,
                "extracted_data": separated,
                "manual_review_needed": not bool(conf),
                "completed_at": datetime.utcnow().isoformat() + "Z",
            }
        )
    except Exception as e:
        task = tasks.setdefault(task_id, {})
        task["status"] = "failed"
        task["error"] = str(e)


def _stub_separated(filename: str) -> Dict[str, Any]:
    return {
        "personalData": {
            "customerName": None,
            "driverLicenseInfo": None,
            "contactInfo": None,
            "paymentMethod": None,
            "confidence": 0,
        },
        "vehicleData": {
            "vin": None,
            "registration": None,
            "make": None,
            "model": None,
            "inspectionDate": None,
            "nextInspectionDate": None,
            "odometer": None,
            "historicalOdometer": [],
            "inspectionResult": None,
            "brakeValues": None,
            "obdTest": None,
            "inspectionNotes": None,
            "inspectionStation": None,
            "confidence": 0,
        },
        "metadata": {
            "documentType": "unknown",
            "processingTime": "~1.0s",
            "requiresManualReview": True,
            "documentHash": f"sha256:{filename}",
            "diaryNumber": None,
        },
    }


def _extract_vin_and_reg(name: str) -> Dict[str, Optional[str]]:
    # VIN: 17 alphanum uppercase
    vin_match = re.search(r'\b([A-HJ-NPR-Z0-9]{17})\b', name)
    vin = vin_match.group(1) if vin_match else None
    # Swedish reg: 3 letters + 3 digits (basic)
    reg_match = re.search(r'\b([A-ZÅÄÖ]{3}\d{3})\b', name)
    reg = reg_match.group(1) if reg_match else None
    return {"vin": vin, "registration": reg}


def _build_separated_from_external(file_path: str, filename: str) -> Dict[str, Any]:
    try:
        ins = build_inspection_from_file(file_path)  # type: ignore
    except Exception:
        ins = None

    vin_reg = _extract_vin_and_reg(filename)

    vehicle = {
        "vin": vin_reg.get("vin"),
        "registration": vin_reg.get("registration"),
        "make": None,
        "model": None,
        "inspectionDate": getattr(ins, "event_date", None) if ins else None,
        "nextInspectionDate": None,
        "odometer": getattr(ins, "odo_km", None) if ins else None,
        "historicalOdometer": [],
        "inspectionResult": getattr(ins, "result", None) if ins else None,
        "brakeValues": {
            "frontLeft": getattr(ins, "brake_fl_kn", None) or getattr(ins, "brake_fl", None),
            "frontRight": getattr(ins, "brake_fr_kn", None) or getattr(ins, "brake_fr", None),
            "rearLeft": getattr(ins, "brake_rl_kn", None) or getattr(ins, "brake_rl", None),
            "rearRight": getattr(ins, "brake_rr_kn", None) or getattr(ins, "brake_rr", None),
        } if ins else None,
        "obdTest": None,
        "inspectionNotes": getattr(ins, "notes", None) if ins else None,
        "inspectionStation": {
            "name": getattr(ins, "workshop_name", None) if ins else None,
            "location": None,
            "orgNumber": None,
            "inspector": None,
        },
        "confidence": 75 if ins else 0,
    }

    return {
        "personalData": {
            "customerName": None,
            "driverLicenseInfo": None,
            "contactInfo": None,
            "paymentMethod": None,
            "confidence": 0,
        },
        "vehicleData": vehicle,
        "metadata": {
            "documentType": "inspection_protocol" if ins else "unknown",
            "processingTime": None,
            "requiresManualReview": False if ins else True,
            "documentHash": f"sha256:{filename}",
            "diaryNumber": None,
        },
    }


@app.get("/api/process/{task_id}")
async def status(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    t = tasks[task_id]
    return ProcessingResult(
        task_id=task_id,
        status=t["status"],
        document_type=t.get("document_type"),
        confidence=t.get("confidence"),
        extracted_data=t.get("extracted_data"),
        manual_review_needed=t.get("manual_review_needed"),
    )


@app.get("/api/results/{task_id}")
async def results(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    t = tasks[task_id]
    if t.get("status") != "completed":
        raise HTTPException(status_code=400, detail="Task not completed")
    return t


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


