# house_builder — 装修辅助产品种子

面向多用户的装修方案对比 Web 产品：结构化入库、套餐对比、Wiki/品牌库（冷启动 enrich 后持久化）、本地 OCR 流水线。

## 仓库结构

```
house_builder/
  apps/web/                 # Next.js App Router（Vercel 部署）
  packages/schema/          # Proposal / Brand / Term JSON Schema + TS
  packages/supabase/        # migrations、RLS、seed SQL
  packages/ingest/          # 本地 OCR Python worker
  packages/enrich/          # 品牌/名词补全逻辑
  packages/device-bridge/   # 测距/水平仪/LiDAR stub（Phase 2）
  content/seed/             # Wiki/品牌 JSON 种子
  houses/demo-90sqm/        # AEs vs A5s 结构化示例
  docs/ROADMAP.md
```

## 快速开始

### 1. 依赖

```bash
npm install
```

### 2. 环境变量

复制 `.env.example` 为 `apps/web/.env.local`：

```bash
cp .env.example apps/web/.env.local
```

填写：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名公钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端 enrich / ingest 用 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 读写令牌 |
| `ENRICH_PROVIDER` | `mock`（默认）/ `search` / `llm` |

### 3. Supabase 数据库

```bash
# 使用 Supabase CLI 或 Dashboard SQL Editor
# 1. 执行 packages/supabase/migrations/20250727000001_init.sql
# 2. 执行 packages/supabase/seed.sql
```

### 4. 本地开发

```bash
npm run dev
```

打开 http://localhost:3000 — 未登录可直接访问 Demo 对比：

`/houses/00000000-0000-4000-8000-000000000001/compare?a=00000000-0000-4000-8000-000000000010&b=00000000-0000-4000-8000-000000000011`

### 5. Vercel 部署

1. 导入 Git 仓库到 Vercel，Root Directory 设为 `apps/web`（或 monorepo 配置 workspace）
2. 安装 Vercel Blob integration
3. 配置同上环境变量
4. 关联 Supabase 项目

## 本地 OCR 流水线

```bash
cd packages/ingest
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# 对本地长图试跑
.venv/bin/python src/worker.py --local ../../assets/demo/8B64F6AC025B21F9083E98A9C885A690.PNG

# 上传后推 draft 回 API
export INGEST_API_URL=http://localhost:3000
export INGEST_SERVICE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
.venv/bin/python src/worker.py \
  --asset-id <uuid> \
  --blob-url <vercel-blob-url>
```

Web 校对页：`/review/<assetId>`

## 多用户与 RLS

| 数据 | 可见性 |
|------|--------|
| `houses` / `proposals` / `proposal_assets` | 仅 `owner_id = auth.uid()` |
| `houses.is_public_demo` | 全员可读（Demo 获客） |
| `terms` / `brands` / `wiki_pages` | 全员可读；写入走 service role enrich |

## Demo 数据（76.34㎡）

- AEs 颗粒板含费预估：**¥108,089**
- A5s 颗粒板含费预估：**¥123,404**
- 差额：**¥15,315**

与根目录 `AEs_vs_A5s_硬装对比_76.34㎡.xlsx` / `extract_brochure_to_xlsx.py` 一致。

## 验收清单

- [ ] 新用户注册 → 创建房屋 → 上传原件到 Blob
- [ ] 未登录浏览 Demo AEs vs A5s 对比
- [ ] 输入未知品牌 → enrich → `/brands` 刷新仍在
- [ ] 对比页名词悬停 + Wiki 长文
- [ ] 用户 A 看不到用户 B 私有房屋（RLS）

## 相关文件

- 原始宣传长图：`assets/demo/8B64F6AC025B21F9083E98A9C885A690.PNG`（AEs）、`assets/demo/2C5AB46DD246F16FC0B2261366FE1E8A.PNG`（A5s）
- Excel 生成脚本：`scripts/extract_brochure_to_xlsx.py`
