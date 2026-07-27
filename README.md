# 住有谱（home_builder）

面向多用户的装修方案结构化、对比与公共知识库种子。Web 部署在
Vercel，认证和结构化数据使用 Supabase，原件使用 Vercel Blob；OCR
只在本机或自建 worker 执行。

## 仓库

- `apps/web`：Next.js 16 App Router、TypeScript、Tailwind
- `packages/schema`：Proposal JSON Schema 与共享类型
- `packages/supabase`：Postgres migration、RLS 和公开 Demo seed
- `packages/ingest`：Tesseract/PaddleOCR 本地 worker
- `packages/enrich`：补全 provider 接口与规范化约定
- `packages/device-bridge`：水平仪、测距和 LiDAR 的 Phase 2 stub
- `houses/demo-90sqm`：76.34㎡ 计价面积示例的来源与价格

## 本地启动

```bash
npm install
cp .env.example apps/web/.env.local
npm run dev
```

未配置 Supabase 时，首页、公开 AEs/A5s 对比、Wiki、品牌库和计算器仍可
浏览；登录、上传、补全和私有工作台需要云端服务。

## Supabase

1. 新建 Supabase 项目，在 SQL Editor 依次运行
   `packages/supabase/migrations/202607270001_initial.sql` 和
   `packages/supabase/seed.sql`。也可将本仓库关联到 Supabase CLI 后执行
   `supabase db push` 与 `supabase db reset`。
2. 在 Authentication → URL Configuration 设置生产 Site URL，并加入
   `http://localhost:3000/auth/callback` 与生产回调地址。
3. 把 Project URL、anon key 和 service role key 填入 Vercel 环境变量。
   service role 只能存在于服务端。

RLS 规则允许匿名读取公开 Demo 和已发布知识；用户只能读写
`owner_id = auth.uid()` 的房屋、资产和间接关联方案。`terms`、`brands`、
`wiki_pages` 不开放客户端写策略，只有 service role 补全流程可写。

## Vercel 与 Blob

在 Vercel 导入仓库，项目 Root Directory 设置为 `apps/web`，创建 Blob
Store 并连接项目。设置 `.env.example` 中的变量后部署。上传 API 会：

1. 验证 Supabase 会话及房屋归属；
2. 限制为 PNG/JPEG/WebP/PDF 且不超过 20MB；
3. 写入用户/房屋命名空间；
4. 将 URL 和 OCR 状态写入 `proposal_assets`。

当前原件用公开 Blob URL 让本地 worker 拉取；URL 虽不可枚举，但不是访问
控制。含敏感信息的生产部署应切换为私有 Blob，并由短期下载 URL 供 worker
使用。

## OCR 闭环

网页上传后取得 `proposal_assets.id`，本机执行：

```bash
python3 packages/ingest/worker.py "$BLOB_URL" \
  --asset-id "$ASSET_ID" --submit \
  --api-base http://localhost:3000 --token "$INGEST_API_TOKEN"
```

worker 把草稿推到 `/api/ingest/drafts`，不会直接写最终方案。房屋所有者在
`/houses/[id]/review` 校对并确认后，Web 才写 `proposals` 与
`proposal_line_items`。安装和 Docker 用法见 `packages/ingest/README.md`。

## 品牌与名词补全

`POST /api/enrich/brand` 或 `/api/enrich/term`，body 为
`{"query":"品牌或名词"}`。接口要求登录：

1. 先按规范名查询 Supabase；
2. 未命中时调用 `ENRICH_API_URL` 指向的 OpenAI-compatible API；
3. 使用严格 schema 规范化并 upsert 公共实体和 Wiki；
4. 把命中、原始响应或失败写入 `enrich_jobs`。

补全模型只生成初始参考，不应用于合同事实判断。生产环境应在 API 前增加
按用户限流，并为 `source=enrich` 内容增加编辑审核队列。

## 验证

```bash
npm run lint
npm run test
npm run build
```

示例价格来自仓库原有 `extract_brochure_to_xlsx.py` 的 50–80㎡公式：
AEs 含费预估 ¥108,091.57，A5s 为 ¥123,405.19，价差 ¥15,313.62。
