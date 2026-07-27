FROM python:3.12-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-chi-sim poppler-utils \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /worker
COPY worker.py .
ENTRYPOINT ["python", "worker.py"]
