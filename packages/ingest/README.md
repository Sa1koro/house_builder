# @house-builder/ingest · 本地 OCR worker

重 OCR 不进 Vercel Serverless。这个 Python worker 在**你自己的机器**（或自建服务器/Docker）上跑：

```
Blob 原件 ──下载──> 本地 OCR（PaddleOCR / tesseract）──> draft Proposal JSON ──推回──> Web API ──人工校对──> proposals
```

## 安装

```bash
cd packages/ingest
python -m venv .venv && source .venv/bin/activate
pip install -e .                        # 基础（requests）
pip install -e ".[paddle]"              # 推荐：PaddleOCR（中文效果好）
# 或过渡方案：
pip install -e ".[tesseract]"           # 需系统装 tesseract-ocr + tesseract-ocr-chi-sim
```

## 使用（最小闭环）

1. 网页登录 → 房屋详情页上传方案长图 → 复制列表里的 `asset_id`。
2. 本机设置环境变量并运行：

```bash
export INGEST_API_BASE=https://your-app.vercel.app   # 本地开发用 http://localhost:3000
export INGEST_WORKER_TOKEN=<与 web 端 .env 一致的密钥>

python -m ingest.worker --asset-id <asset_id> --push
```

3. 回到网页，该原件状态变为「待校对」→ 点「去校对入库」，对照原件修订 JSON 后确认。

## 离线试跑（不连 API）

```bash
python -m ingest.worker --file ../../houses/demo-90sqm/source/aes-brochure.png --out draft.json
# 已有转录文本（跳过 OCR）：
python -m ingest.worker --text lines.txt --out draft.json
```

## 说明

- draft 只求「大致成形」：价格项、空间-品类-品牌行会尽力抽取，识别不了的行进 `notes`（带 `[OCR]` 前缀），一切以校对页人工确认为准。
- draft 结构见 `packages/schema/schemas/proposal.schema.json`；入库前 Web 端会再做 schema 校验。
- worker 与 Web 的鉴权是共享密钥（`INGEST_WORKER_TOKEN`），只允许写 `proposal_assets.ocr_draft`，不能直接写方案表。
