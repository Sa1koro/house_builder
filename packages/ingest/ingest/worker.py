"""本地 OCR worker CLI。

最小闭环：
  1. 网页上传原件 → 记下 asset_id（房屋详情页可复制）
  2. 本机执行：python -m ingest.worker --asset-id <id> --push
     worker 经 Web API 取 blob_url → 下载 → OCR → 生成 draft → 推回
  3. 网页「去校对入库」确认后写入 proposals

环境变量：
  INGEST_API_BASE       Web 地址，默认 http://localhost:3000
  INGEST_WORKER_TOKEN   与 Vercel/本地 .env 中一致的共享密钥

也可离线试跑（不连 API）：
  python -m ingest.worker --file 长图.png --out draft.json
  python -m ingest.worker --text 已转录.txt --out draft.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path

import requests

from .draft import build_draft
from .ocr import OcrUnavailableError, run_ocr


def api_base() -> str:
    return os.environ.get("INGEST_API_BASE", "http://localhost:3000").rstrip("/")


def auth_headers() -> dict[str, str]:
    token = os.environ.get("INGEST_WORKER_TOKEN")
    if not token:
        sys.exit("缺少环境变量 INGEST_WORKER_TOKEN（与 web 端 .env 保持一致）")
    return {"Authorization": f"Bearer {token}"}


def fetch_asset(asset_id: str) -> dict:
    res = requests.get(f"{api_base()}/api/ingest/asset", params={"id": asset_id}, headers=auth_headers(), timeout=30)
    if res.status_code != 200:
        sys.exit(f"取 asset 失败 [{res.status_code}]: {res.text}")
    return res.json()


def download(url: str) -> Path:
    res = requests.get(url, timeout=120)
    res.raise_for_status()
    suffix = Path(url.split("?")[0]).suffix or ".png"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(res.content)
    tmp.close()
    return Path(tmp.name)


def push_draft(asset_id: str, draft: dict | None, error: str | None = None) -> None:
    payload: dict = {"asset_id": asset_id}
    if error:
        payload["error"] = error
    else:
        payload["draft"] = draft
    res = requests.post(f"{api_base()}/api/ingest/draft", json=payload, headers=auth_headers(), timeout=30)
    if res.status_code != 200:
        sys.exit(f"推 draft 失败 [{res.status_code}]: {res.text}")
    print(f"已推回: {res.json()}")


def main() -> None:
    p = argparse.ArgumentParser(description="house_builder 本地 OCR worker")
    src = p.add_mutually_exclusive_group()
    src.add_argument("--asset-id", help="proposal_assets.id（经 Web API 取 blob 并推回）")
    src.add_argument("--file", type=Path, help="本地图片路径（离线试跑）")
    src.add_argument("--url", help="图片 URL（离线试跑）")
    p.add_argument("--text", type=Path, help="跳过 OCR，直接用该文本文件（每行一条）生成 draft")
    p.add_argument("--engine", choices=["auto", "paddle", "tesseract"], default="auto")
    p.add_argument("--out", type=Path, help="把 draft 写到本地文件")
    p.add_argument("--push", action="store_true", help="推回 Web API（--asset-id 时可用）")
    args = p.parse_args()

    if not (args.asset_id or args.file or args.url or args.text):
        p.error("需要 --asset-id / --file / --url / --text 之一")

    image_path: Path | None = None
    source_note = ""
    if args.asset_id:
        asset = fetch_asset(args.asset_id)
        print(f"asset: {asset['id']} · {asset.get('mime')} · {asset['blob_url']}")
        if not args.text:
            image_path = download(asset["blob_url"])
        source_note = f"来源 asset: {asset['id']}"
    elif args.file:
        image_path = args.file
    elif args.url:
        image_path = download(args.url)

    try:
        if args.text:
            lines = [ln.strip() for ln in args.text.read_text(encoding="utf-8").splitlines() if ln.strip()]
        else:
            assert image_path is not None
            print(f"OCR({args.engine}) 解析 {image_path} …")
            lines = run_ocr(image_path, engine=args.engine)
        print(f"共 {len(lines)} 行文本")
        draft = build_draft(lines, source_note=source_note)
    except OcrUnavailableError as exc:
        if args.asset_id and args.push:
            push_draft(args.asset_id, None, error=str(exc))
        sys.exit(f"OCR 失败: {exc}")

    out_text = json.dumps(draft, ensure_ascii=False, indent=2)
    if args.out:
        args.out.write_text(out_text, encoding="utf-8")
        print(f"draft 已写入 {args.out}")
    else:
        print(out_text)

    if args.push:
        if not args.asset_id:
            sys.exit("--push 需要 --asset-id")
        push_draft(args.asset_id, draft)
        print("完成。回到网页「去校对入库」确认草稿。")


if __name__ == "__main__":
    main()
