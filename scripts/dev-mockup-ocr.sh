#!/bin/bash
set -euo pipefail
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
APP_DIR="$ROOT_DIR/apps/mockup-web"
export VITE_OCR_API_URL="${VITE_OCR_API_URL:-http://localhost:8000}"
cd "$APP_DIR"
npm ci
exec npm run dev
