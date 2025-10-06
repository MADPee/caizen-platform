#!/bin/bash
set -euo pipefail
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
API_DIR="$ROOT_DIR/apps/ocr-api"
SCRIPTS_ROOT_DEFAULT="/Users/marcusanderssondipace/Library/Mobile Documents/com~apple~CloudDocs/BMW 118i_CAH643_WBAUM11070VH69821"
export CAIZEN_OCR_SCRIPTS_ROOT="${CAIZEN_OCR_SCRIPTS_ROOT:-$SCRIPTS_ROOT_DEFAULT}"

command -v tesseract >/dev/null 2>&1 || { echo "Tesseract is required. Install via 'brew install tesseract'"; exit 1; }

cd "$API_DIR"
python3 -m venv .venv >/dev/null 2>&1 || true
source .venv/bin/activate
pip install -q -r requirements.txt
exec uvicorn main:app --reload --host 0.0.0.0 --port 8000
