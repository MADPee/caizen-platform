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

        # TODO: Integrate real OCR and parsing here
        # For now, produce a deterministic demo payload
        filename = os.path.basename(task["file_path"]) or "document"
        separated = {
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

        task.update(
            {
                "status": "completed",
                "document_type": "unknown",
                "confidence": 0.0,
                "extracted_data": separated,
                "manual_review_needed": True,
                "completed_at": datetime.utcnow().isoformat() + "Z",
            }
        )
    except Exception as e:
        task = tasks.setdefault(task_id, {})
        task["status"] = "failed"
        task["error"] = str(e)


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


