SHELL := /bin/bash

.PHONY: ocr-api mockup-web dev-stack

ocr-api:
	./scripts/ocr-dev.sh

mockup-web:
	./scripts/dev-mockup.sh

mockup-web-ocr:
	./scripts/dev-mockup-ocr.sh

# Start OCR API and then frontend (OCR)
dev-stack:
	(./scripts/ocr-dev.sh &) && sleep 1 && ./scripts/dev-mockup-ocr.sh
