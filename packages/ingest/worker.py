"""Local-only OCR draft producer. Do not deploy this worker to Vercel."""
import argparse
import json
from pathlib import Path

import pytesseract
import requests
from PIL import Image


def load_image(source: str) -> Image.Image:
    if source.startswith(("http://", "https://")):
        response = requests.get(source, timeout=60)
        response.raise_for_status()
        path = Path("/tmp/house-builder-ocr-input")
        path.write_bytes(response.content)
        return Image.open(path)
    return Image.open(source)


def main() -> None:
    parser = argparse.ArgumentParser(description="Produce a review-required ProposalDraft from a local path or Blob URL.")
    parser.add_argument("source")
    parser.add_argument("--company", default="待校对")
    parser.add_argument("--package", dest="package_name", default="待校对")
    parser.add_argument("--output", default="proposal-draft.json")
    args = parser.parse_args()
    text = pytesseract.image_to_string(load_image(args.source), lang="chi_sim+eng")
    draft = {
        "company": args.company,
        "package_name": args.package_name,
        "version": "ocr-draft",
        "usable_area_sqm": 0,
        "pricing": {},
        "line_items": [],
        "review_required": True,
        "raw_ocr_text": text,
    }
    Path(args.output).write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
