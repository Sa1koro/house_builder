# 筑家 / house_builder

多用户装修方案助手的第一期种子：私有房屋和方案、公开的品牌/Wiki、Blob 原件，以及在本机运行的 OCR 草稿流水线。

## 本地启动

1. 安装 Node 20+ 与 pnpm，复制环境变量：
   ```bash
   cp .env.example .env.local
   ```
2. 在 Supabase SQL Editor 或 Supabase CLI 中按顺序执行：
   - `packages/supabase/migrations/20260727160000_initial.sql`
   - `packages/supabase/seed.sql`
3. 在 Vercel 项目连接 Supabase 与 Blob，填入 `.env.local`；**不要**将 `SUPABASE_SERVICE_ROLE_KEY` 公开给浏览器。
4. 安装、启动：
   ```bash
   pnpm install
   pnpm dev
   ```

`/demo/compare` 是未登录可访问的 AEs/A5s 示例。登录后可在 `/houses` 创建自己的房屋；RLS 只允许所有者读写私有数据。

## 文件与 OCR

浏览器仅向 `/api/upload` 请求 Vercel Blob 上传令牌，上传路径被限制为当前用户命名空间。原件地址写入 `proposal_assets` 后，由本机或自建 worker 识别；Vercel 不运行重 OCR。

```bash
python -m venv .venv
.venv/bin/pip install -r packages/ingest/requirements.txt
.venv/bin/python packages/ingest/worker.py brochure.png --output proposal-draft.json
```

安装系统的 Tesseract 与中文语言包后可使用 `chi_sim+eng`。worker 只产出 `review_required` 草稿，必须由 Web 校对流程确认后写入 proposal 表。

## Enrich

`POST /api/enrich/brand` 或 `/api/enrich/term`（需登录）先查公共表，再调用可选的 `ENRICH_API_URL`。服务端规范化后使用 service role 写入公共词条与 `enrich_jobs` 审计表。未配置 provider 时会创建低置信度待审核草稿，避免把猜测伪装成事实。

## 部署

将 `apps/web` 作为 Vercel Root Directory。将所有 `.env.example` 键加入 Vercel 环境变量；`BLOB_READ_WRITE_TOKEN` 由 Blob 存储提供。部署后在 Supabase Auth 的 Redirect URLs 添加：

```
https://你的域名/auth/callback
http://localhost:3000/auth/callback
```

详细扩展计划见 [docs/ROADMAP.md](docs/ROADMAP.md)。
