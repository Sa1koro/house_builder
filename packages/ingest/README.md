# Local OCR ingest

OCR runs outside Vercel. The default adapter calls local Tesseract; PaddleOCR is
an optional higher-quality adapter.

```bash
# Ubuntu
sudo apt install tesseract-ocr tesseract-ocr-chi-sim poppler-utils

# Produce a local JSON draft
python3 packages/ingest/worker.py quote.png \
  --company 圣都整装 --package AEs --pricing-area 76.34

# Upload the draft to an existing proposal_assets row
python3 packages/ingest/worker.py "https://blob.example/quote.png" \
  --asset-id 00000000-0000-0000-0000-000000000000 \
  --submit --api-base http://localhost:3000 --token "$INGEST_API_TOKEN"
```

For Docker:

```bash
docker build -t home-builder-ocr packages/ingest
docker run --rm -v "$PWD:/data" home-builder-ocr /data/quote.png --output /data/draft.json
```

The generated draft is deliberately conservative: it preserves OCR text in a
review item and only guesses the largest plausible amount as the total. Final
records are created only after the owner confirms the draft in the web UI.
