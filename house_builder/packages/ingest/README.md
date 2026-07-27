# Local OCR ingest for house_builder

Heavy OCR runs **here** (laptop / Docker / self-hosted), not on Vercel Serverless.

## Quick start

```bash
cd packages/ingest
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# optional: brew/apt install tesseract + chi_sim

# Stub / tesseract draft from demo long-image
python worker.py \
  --image ../../houses/demo-90sqm/8B64F6AC025B21F9083E98A9C885A690.PNG \
  --package AEs \
  --area 76.34

# Push draft into Web review queue
export INGEST_WEB_CALLBACK_URL=http://localhost:3000/api/ingest/draft
export INGEST_API_SECRET=dev-ingest-secret
python worker.py --image ./shot.png --package A5s --post --asset-id <uuid>
```

## Docker

```bash
docker build -t house-builder-ingest .
docker run --rm -v "$PWD/../../houses:/data" house-builder-ingest \
  --image /data/demo-90sqm/8B64F6AC025B21F9083E98A9C885A690.PNG --package AEs
```

Draft JSON is reviewed at `/ingest/review` then confirmed into `proposals`.
