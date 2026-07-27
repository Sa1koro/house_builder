#!/usr/bin/env python3
"""Local OCR worker: image/PDF -> reviewable Proposal JSON -> web API.

The worker intentionally does not write final proposals. It uploads an OCR draft
to proposal_assets; the owner reviews and confirms it in the web application.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import re
import subprocess
import tempfile
import urllib.request
from pathlib import Path


def materialize(source: str, directory: Path) -> Path:
    if source.startswith(("https://", "http://")):
        suffix = Path(source.split("?", 1)[0]).suffix or ".img"
        target = directory / f"source{suffix}"
        urllib.request.urlretrieve(source, target)
        return target
    path = Path(source).expanduser().resolve()
    if not path.is_file():
        raise FileNotFoundError(path)
    return path


def pages(path: Path, directory: Path) -> list[Path]:
    mime = mimetypes.guess_type(path.name)[0]
    if mime != "application/pdf" and path.suffix.lower() != ".pdf":
        return [path]
    prefix = directory / "page"
    subprocess.run(["pdftoppm", "-png", "-r", "200", str(path), str(prefix)], check=True)
    return sorted(directory.glob("page-*.png"))


def tesseract_ocr(images: list[Path], language: str) -> str:
    output: list[str] = []
    for image in images:
        result = subprocess.run(
            ["tesseract", str(image), "stdout", "-l", language, "--psm", "6"],
            check=True,
            text=True,
            capture_output=True,
        )
        output.append(result.stdout)
    return "\n".join(output)


def paddle_ocr(images: list[Path], language: str) -> str:
    try:
        from paddleocr import PaddleOCR  # type: ignore
    except ImportError as exc:
        raise RuntimeError("PaddleOCR 未安装；执行 pip install paddleocr 后重试") from exc
    ocr = PaddleOCR(lang="ch" if language.startswith("chi") else language, use_doc_orientation_classify=True)
    lines: list[str] = []
    for image in images:
        result = ocr.predict(str(image))
        for page in result:
            data = page.json.get("res", page.json)
            lines.extend(data.get("rec_texts", []))
    return "\n".join(lines)


def to_draft(text: str, source: str, company: str, package_name: str, area: float | None) -> dict:
    amounts = []
    for raw in re.findall(r"(?<!\d)(\d{4,7}(?:\.\d{1,2})?)(?!\d)", text.replace(",", "")):
        value = float(raw)
        if 1_000 <= value <= 10_000_000:
            amounts.append(value)
    total = max(amounts, default=0)
    nonempty = [line.strip() for line in text.splitlines() if line.strip()]
    raw_excerpt = "\n".join(nonempty[:120])
    return {
        "company": company,
        "packageName": package_name,
        "version": "OCR draft",
        "currency": "CNY",
        **({"pricingArea": area} if area is not None else {}),
        "costs": {
            "hardFit": total,
            "customization": 0,
            "management": 0,
            "projectManager": 0,
            "total": total,
        },
        "lineItems": [{
            "space": "待校对",
            "category": "OCR 原文",
            "specification": raw_excerpt,
            "brands": [],
            "termSlugs": [],
            "notes": "自动生成的原文草稿；请在网页中拆分条目并核对价格。",
        }],
        **({"sourceAssetUrl": source} if source.startswith(("https://", "http://")) else {}),
        "ocrConfidence": 0.5,
    }


def submit(api_base: str, token: str, asset_id: str, draft: dict) -> dict:
    request = urllib.request.Request(
        f"{api_base.rstrip('/')}/api/ingest/drafts",
        data=json.dumps({"assetId": asset_id, "draft": draft}, ensure_ascii=False).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run OCR locally and create a review draft")
    parser.add_argument("source", help="Local image/PDF path or Blob URL")
    parser.add_argument("--asset-id", help="proposal_assets UUID; required with --submit")
    parser.add_argument("--api-base", default="http://localhost:3000")
    parser.add_argument("--token", help="INGEST_API_TOKEN; required with --submit")
    parser.add_argument("--submit", action="store_true")
    parser.add_argument("--engine", choices=("tesseract", "paddle"), default="tesseract")
    parser.add_argument("--language", default="chi_sim+eng")
    parser.add_argument("--company", default="待校对")
    parser.add_argument("--package", dest="package_name", default="待校对方案")
    parser.add_argument("--pricing-area", type=float)
    parser.add_argument("--output", type=Path, default=Path("output/draft.json"))
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="home-builder-ocr-") as temp:
        directory = Path(temp)
        path = materialize(args.source, directory)
        image_pages = pages(path, directory)
        text = tesseract_ocr(image_pages, args.language) if args.engine == "tesseract" else paddle_ocr(image_pages, args.language)
        draft = to_draft(text, args.source, args.company, args.package_name, args.pricing_area)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(draft, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Draft written: {args.output}")
    if args.submit:
        if not args.asset_id or not args.token:
            parser.error("--submit requires --asset-id and --token")
        result = submit(args.api_base, args.token, args.asset_id, draft)
        print(f"Draft submitted: {result['id']} ({result['ocr_status']})")


if __name__ == "__main__":
    main()
