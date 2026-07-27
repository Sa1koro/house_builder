# house_builder · 装修辅助产品（种子一期）

面向多用户的装修辅助 Web 产品：用户注册后上传自家装修方案、对比套餐、查品牌档次与装修名词；公共知识库（Wiki/品牌）跨用户复用与沉淀。

**免登录试玩**：预置公开示例房（圣都整装 AEs vs A5s，售卖 90㎡ / 计价 76.34㎡），首页一键进入对比。

## 技术栈（定死）

| 层 | 选型 |
| --- | --- |
| 前端/API | Next.js App Router + TypeScript + Tailwind，部署 **Vercel** |
| Auth / DB | **Supabase** Auth + Postgres + Row Level Security |
| 文件 | **Vercel Blob**（方案长图/PDF） |
| 方案规范 | JSON Schema（人类 + LLM 共用） |
| OCR | 本地 Python worker（PaddleOCR / tesseract 过渡），**不进 Vercel Serverless** |
| 品牌/名词补全 | `/api/enrich/brand|term`：先查 DB → miss 则外搜/LLM → upsert 持久化 |
| 传感器 | `packages/device-bridge` 接口占位（Phase 2 iOS） |

## 仓库结构

```
apps/web/                 # Next.js（Vercel）
packages/schema/          # proposal/brand/term JSON Schema + TS 类型 + ajv 校验
packages/supabase/        # migrations（含 RLS）、seed.sql、生成脚本
packages/ingest/          # 本地 OCR worker（Python）
packages/enrich/          # 品牌/名词补全：search → normalize → persist
packages/device-bridge/   # 测距/水平仪/LiDAR stub
content/seed/             # 首批 terms/brands JSON + wiki Markdown
houses/demo-90sqm/        # 示例房结构化方案（AEs/A5s）+ 原始素材
docs/ROADMAP.md
.env.example
```

## 快速开始（本地开发）

```bash
pnpm install
cp .env.example apps/web/.env.local   # 按下文填好变量
pnpm dev                              # http://localhost:3000
```

### 1. Supabase

1. [supabase.com](https://supabase.com) 新建项目。
2. SQL Editor 依次执行 `packages/supabase/migrations/0001_init.sql` 和 `packages/supabase/seed.sql`。
3. Authentication → Providers → Email：开发阶段建议关闭「Confirm email」（或使用 Magic Link）。
4. 把 `Project URL` / `anon key` / `service_role key` 填进 env。

### 2. Vercel Blob

Vercel 项目 → Storage → 创建 Blob store → 把 `BLOB_READ_WRITE_TOKEN` 填进 env（本地开发也用这个 token）。

### 3. 环境变量（`.env.example` 全量说明）

| 变量 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 前端与 RLS 会话 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端写公共表（enrich / ingest），勿泄漏 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 上传 |
| `NEXT_PUBLIC_SITE_URL` | 邮件回跳地址 |
| `ENRICH_SEARCH_PROVIDER` / `TAVILY_API_KEY` | 可选：品牌/名词外搜 |
| `ENRICH_LLM_BASE_URL` / `ENRICH_LLM_API_KEY` / `ENRICH_LLM_MODEL` | 可选：OpenAI 兼容 LLM 规范化（未配置时 enrich 落低置信度占位条目） |
| `INGEST_WORKER_TOKEN` | 本地 OCR worker 推 draft 的共享密钥（自行生成随机串） |

## 部署到 Vercel（多用户上线）

1. 仓库推到 GitHub，Vercel 导入；**Root Directory 选 `apps/web`**（Vercel 自动识别 pnpm workspace）。
2. 在 Vercel 项目 Environment Variables 里配置上表所有变量。
3. Supabase Authentication → URL Configuration：`Site URL` 填 Vercel 域名，Redirect URLs 加 `https://<域名>/auth/callback`。
4. 部署完成后验证验收清单（见下）。

## OCR 流程（本地跑，不上云）

```bash
cd packages/ingest
python -m venv .venv && source .venv/bin/activate
pip install -e ".[paddle]"     # 或 [tesseract]

export INGEST_API_BASE=https://your-app.vercel.app
export INGEST_WORKER_TOKEN=<同 env>
python -m ingest.worker --asset-id <网页上传后显示的 asset_id> --push
```

然后回网页点「去校对入库」。详见 `packages/ingest/README.md`。

## 多租户与数据可见性

- **用户私有**（RLS `owner_id = auth.uid()`）：`houses`、`proposals`、`proposal_line_items`、`proposal_assets`。
- **公开示例**：`is_public_demo = true` 的房及其方案，匿名可读。
- **公共知识**（全员可读，写入仅 service role）：`terms`、`brands`、`wiki_pages`；来源标注 `seed / enrich / editor` + `confidence`。
- **审计**：`enrich_jobs` 记录每次外搜补全（query、provider、raw、result_id）。

## 验收清单（第一期）

- [ ] 新用户可注册、创建房屋、上传方案原件到 Blob
- [ ] 未登录可对比示例房 AEs vs A5s（基础价差 ¥13,434，含费差 ¥15,314.76，与 Excel 一致）
- [ ] 搜索库中没有的品牌 → enrich 后出现在 `/brands` 且刷新仍在
- [ ] 对比页名词可悬停释义；`/wiki/<slug>` 可看长文
- [ ] RLS：用户 A 看不到用户 B 的私有房屋/方案

## 更多

- 路线图：`docs/ROADMAP.md`
- 修改种子数据：编辑 `content/seed/` 后 `pnpm seed:build` 重新生成 `seed.sql`
