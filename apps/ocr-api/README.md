# CaiZen OCR API (FastAPI)

Dev server:
```bash
cd apps/ocr-api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:
- POST /api/upload → { task_id }
- GET /api/process/{task_id}
- GET /api/results/{task_id}

Notes:
- Stubbar OCR/extraktion just nu. Byt till riktig pipeline senare.
- Tillåt CORS i dev, lås ner i prod.
