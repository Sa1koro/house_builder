"""Local OCR ingest worker for house_builder.

Flow:
  1. Download proposal asset from Vercel Blob URL (or read local path)
  2. Run OCR (tesseract if available; otherwise structured stub from filename hints)
  3. Emit draft Proposal JSON
  4. POST to /api/ingest/draft for human review queue

Usage:
  python -m ingest.worker --image ./houses/demo-90sqm/8B64....PNG --package AEs
  python -m ingest.worker --blob-url https://... --asset-id <uuid>

Heavy OCR stays off Vercel Serverless — run on a laptop or self-hosted worker.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def try_tesseract(image_path: Path) -> str:
    try:
        import pytesseract
        from PIL import Image
    except ImportError:
        return ""
    try:
        img = Image.open(image_path)
        return pytesseract.image_to_string(img, lang="chi_sim+eng") or ""
    except Exception as exc:  # noqa: BLE001
        print(f"[ingest] tesseract failed: {exc}", file=sys.stderr)
        return ""


def guess_package(text: str, hint: str | None) -> str:
    if hint:
        return hint
    if re.search(r"A5s", text, re.I):
        return "A5s"
    if re.search(r"AEs", text, re.I):
        return "AEs"
    return "unknown"


def build_draft(
    *,
    package_name: str,
    ocr_text: str,
    source_path: str,
    billing_area: float = 76.34,
    sales_area: float = 90.0,
) -> dict[str, Any]:
    """Minimal draft — real layouts need human review in /ingest/review."""
    is_a5s = package_name.upper().startswith("A5")
    hard_base = 75800 if is_a5s else 65000
    overage_unit = 799 if is_a5s else 699
    overage_area = round(billing_area - 50, 2)
    overage_fee = round(overage_area * overage_unit, 2)
    hard_subtotal = round(hard_base + overage_fee, 2)
    custom_p, custom_s = 13000, 16000
    base_p = hard_subtotal + custom_p
    base_s = hard_subtotal + custom_s
    mgmt = round(hard_subtotal * 0.12, 2)
    pm = round(hard_subtotal * 0.02, 2)

    return {
        "draft_version": "0.1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_path": source_path,
        "ocr_engine": "tesseract" if ocr_text else "stub",
        "ocr_text_preview": (ocr_text or "")[:2000],
        "needs_review": True,
        "proposal": {
            "company": "圣都整装",
            "package_name": package_name,
            "version": "ocr-draft",
            "billing_area_sqm": billing_area,
            "sales_area_sqm": sales_area,
            "source": "ocr_review",
            "costs": {
                "hard_base": hard_base,
                "overage_unit": overage_unit,
                "overage_area": overage_area,
                "overage_fee": overage_fee,
                "hard_subtotal": hard_subtotal,
                "custom_particle": custom_p,
                "custom_solid": custom_s,
                "base_particle": round(base_p, 2),
                "base_solid": round(base_s, 2),
                "mgmt_fee": mgmt,
                "pm_fee": pm,
                "total_particle": round(base_p + mgmt + pm, 2),
                "total_solid": round(base_s + mgmt + pm, 2),
                "currency": "CNY",
            },
            "line_items": [],
            "notes": [
                "OCR draft — 请在 Web 校对页确认后入库",
                "line_items 需人工对照宣传页补全",
            ],
        },
    }


def download_blob(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, dest)  # noqa: S310 — intentional worker download
    return dest


def post_draft(callback_url: str, secret: str, payload: dict[str, Any]) -> None:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        callback_url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-ingest-secret": secret,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:  # noqa: S310
        print(resp.read().decode("utf-8"))


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="house_builder local OCR ingest worker")
    p.add_argument("--image", type=Path, help="Local image/PDF path")
    p.add_argument("--blob-url", type=str, help="Vercel Blob URL")
    p.add_argument("--asset-id", type=str, help="proposal_assets.id for callback")
    p.add_argument("--package", type=str, help="Package hint e.g. AEs / A5s")
    p.add_argument("--area", type=float, default=76.34)
    p.add_argument("--sales-area", type=float, default=90.0)
    p.add_argument(
        "--out",
        type=Path,
        default=None,
        help="Write draft JSON to path (default: stdout or drafts/)",
    )
    p.add_argument("--post", action="store_true", help="POST draft to web callback")
    args = p.parse_args(argv)

    work = Path(os.environ.get("INGEST_WORK_DIR", "./drafts"))
    work.mkdir(parents=True, exist_ok=True)

    if args.blob_url:
        image_path = download_blob(args.blob_url, work / "download.bin")
        source = args.blob_url
    elif args.image:
        image_path = args.image
        source = str(args.image)
    else:
        p.error("Provide --image or --blob-url")
        return 2

    ocr_text = try_tesseract(image_path)
    package = guess_package(ocr_text + " " + source, args.package)
    draft = build_draft(
        package_name=package,
        ocr_text=ocr_text,
        source_path=source,
        billing_area=args.area,
        sales_area=args.sales_area,
    )
    if args.asset_id:
        draft["asset_id"] = args.asset_id

    out = args.out or work / f"draft-{package}-{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    out.write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[ingest] wrote {out.resolve()}")

    if args.post:
        callback = os.environ.get(
            "INGEST_WEB_CALLBACK_URL", "http://localhost:3000/api/ingest/draft"
        )
        secret = os.environ.get("INGEST_API_SECRET", "dev-ingest-secret")
        post_draft(callback, secret, draft)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
