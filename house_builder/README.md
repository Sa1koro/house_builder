# 家装助手 · House Builder

多用户装修辅助产品种子（第一期）：方案结构化对比、名词 Wiki、品牌档次库、冷启动 enrich、本地 OCR 校对。部署于 **Vercel**，数据在 **Supabase**，原件在 **Vercel Blob**。

## 仓库结构

```
house_builder/
  apps/web/                 # Next.js App Router（Vercel）
  packages/schema/          # proposal / brand / term JSON Schema + Zod
  packages/supabase/        # migrations + RLS + seed SQL
  packages/ingest/          # 本地 OCR worker（勿上 Serverless）
  packages/enrich/          # 品牌/名词：查库 → 外搜/LLM → 持久化
  packages/device-bridge/   # 测距/水平仪/LiDAR stub
  content/seed/             # 品牌/名词种子 JSON
  houses/demo-90sqm/        # AEs / A5s 示例结构化方案
  docs/ROADMAP.md
  .env.example
```

## 快速开始（本地 Demo，无需云账号）

```bash
cd house_builder
pnpm install
pnpm --filter @house-builder/web dev
```

打开 http://localhost:3000 ：

- 未登录可对比 Demo 房 **AEs vs A5s**（76.34㎡ 价差与种子数据一致）
- `/wiki`、`/brands` 使用本地种子；品牌冷启动写入内存 store（进程内持久）

## 多用户部署（Vercel + Supabase + Blob）

1. **Supabase**：新建项目，依次执行  
   `packages/supabase/migrations/20260327000001_init.sql`  
   `…000002_seed_demo.sql`  
   `…000003_seed_knowledge.sql`
2. **Vercel**：导入本仓库，Root Directory 设为 `house_builder/apps/web`（或 monorepo 按你的部署方式配置）；安装 `pnpm`。
3. **环境变量**：复制 `.env.example` → Vercel / `apps/web/.env.local`，填入：
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`（仅服务端，用于 enrich 写入公共表）
   - `BLOB_READ_WRITE_TOKEN`
   - 可选 `ENRICH_PROVIDER=openai` + `ENRICH_API_KEY`
4. Auth：在 Supabase 启用 Email / Magic Link，Redirect URL 含 `https://你的域名/auth/callback`。

### 数据可见性与 RLS

| 数据 | 可见性 |
|------|--------|
| `houses` / `proposals` / `proposal_assets` | 仅 `owner_id = auth.uid()`；`is_public_demo` 全员可读 |
| `terms` / `brands` / `wiki_pages` | 全员可读；写入走 service role / enrich |
| Demo 房 | `aaaaaaaa-bbbb-cccc-dddd-000000000001` 未登录可对比 |

用户 A 无法 SELECT 用户 B 的私有房屋/方案（见 migration RLS policies）。

## OCR 约定

- **Vercel**：Web、API、enrich、读写 Supabase/Blob
- **本机 / Docker**：`packages/ingest` worker 拉 Blob 或本地图 → draft JSON → `POST /api/ingest/draft` → `/ingest/review` 校对入库

详见 `packages/ingest/README.md`。

## 验收对照

- [x] 脚手架：Next.js + migrations/RLS + Blob API + `.env.example`
- [x] Auth 页 + House CRUD API + Demo seed（本地/SQL）
- [x] 对比页总价/配置 + TermHint
- [x] Wiki / 品牌 + enrich 冷启动持久化
- [x] 本地 OCR worker 最小闭环 + 校对页
- [x] device-bridge stub + ROADMAP

## 脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Web |
| `pnpm build` | 生产构建 |
| `pnpm lint` | ESLint |

根目录历史 Excel/长图已同步至 `houses/demo-90sqm/`，原始 `extract_brochure_to_xlsx.py` 仍可在仓库根使用。
