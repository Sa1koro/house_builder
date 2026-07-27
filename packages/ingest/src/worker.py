#!/usr/bin/env python3
"""Local OCR ingest worker for house_builder.

Downloads proposal images from Vercel Blob (or local path), runs OCR,
and posts draft JSON back to the web API for human review.

Usage:
  python worker.py --asset-id <uuid> --blob-url <url>
  python worker.py --local path/to/image.png --house-id <uuid>

Requires: requests, pillow; optional pytesseract for OCR.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Install: pip install requests pillow", file=sys.stderr)
    sys.exit(1)


def ocr_image(image_path: Path) -> dict:
    """Run OCR and return draft proposal structure."""
    try:
        import pytesseract
        from PIL import Image

        text = pytesseract.image_to_string(Image.open(image_path), lang="chi_sim")
    except Exception as e:
        text = f"[OCR unavailable: {e}]"

    return {
        "company": "待识别",
        "packageName": "待识别",
        "version": "draft",
        "pricing": {
            "hardBase": 0,
            "totals": {
                "baseParticle": 0,
                "baseSolidWood": 0,
                "withFeesParticle": 0,
                "withFeesSolidWood": 0,
            },
        },
        "lineItems": [],
        "notes": [f"OCR raw excerpt (first 500 chars): {text[:500]}"],
        "_draft": {
            "ocrConfidence": 0.3 if "[OCR unavailable" in text else 0.6,
            "reviewed": False,
        },
    }


def download_blob(url: str, dest: Path) -> None:
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    dest.write_bytes(resp.content)


def post_draft(api_url: str, service_key: str, asset_id: str, draft: dict) -> None:
    endpoint = f"{api_url.rstrip('/')}/api/ingest/draft"
    resp = requests.post(
        endpoint,
        headers={
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        },
        json={"assetId": asset_id, "draft": draft},
        timeout=30,
    )
    resp.raise_for_status()
    print(json.dumps(resp.json(), ensure_ascii=False, indent=2))


def main() -> None:
    p = argparse.ArgumentParser(description="House Builder OCR ingest worker")
    p.add_argument("--asset-id", help="proposal_assets UUID")
    p.add_argument("--blob-url", help="Vercel Blob URL to download")
    p.add_argument("--local", type=Path, help="Local image path (skip download)")
    p.add_argument("--house-id", help="House UUID (for local-only mode)")
    p.add_argument("--api-url", default=os.environ.get("INGEST_API_URL", "http://localhost:3000"))
    p.add_argument("--service-key", default=os.environ.get("INGEST_SERVICE_KEY", ""))
    args = p.parse_args()

    work_dir = Path("/tmp/house-builder-ingest")
    work_dir.mkdir(exist_ok=True)

    if args.local:
        image_path = args.local
    elif args.blob_url:
        image_path = work_dir / "asset.png"
        print(f"Downloading {args.blob_url}...")
        download_blob(args.blob_url, image_path)
    else:
        p.error("Provide --local or --blob-url")

    print(f"Running OCR on {image_path}...")
    draft = ocr_image(image_path)

    if args.asset_id and args.service_key:
        print(f"Posting draft for asset {args.asset_id}...")
        post_draft(args.api_url, args.service_key, args.asset_id, draft)
    else:
        print(json.dumps(draft, ensure_ascii=False, indent=2))
        print("\n(Set --asset-id and INGEST_SERVICE_KEY to push to API)")


if __name__ == "__main__":
    main()
