FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr tesseract-ocr-chi-sim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY worker.py ./ingest/worker.py
COPY __init__.py ./ingest/__init__.py

ENV PYTHONPATH=/app
ENTRYPOINT ["python", "-m", "ingest.worker"]
