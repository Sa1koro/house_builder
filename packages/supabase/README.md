# @house-builder/supabase

Supabase 数据库层：migrations（含 RLS）、seed 数据、生成脚本。

## 目录

```
migrations/0001_init.sql   # 核心表 + 枚举 + RLS + 注册触发器
seed.sql                   # 生成的种子数据（terms/brands/wiki + demo 房）
scripts/build-seed.mjs     # 从 content/seed + houses/demo-90sqm 生成 seed.sql
```

## 初始化一个新 Supabase 项目

1. [supabase.com](https://supabase.com) 新建项目，记下 `Project URL` / `anon key` / `service_role key`。
2. Dashboard → SQL Editor，粘贴执行 `migrations/0001_init.sql`。
3. 再粘贴执行 `seed.sql`（可重复执行，upsert 幂等）。
4. Authentication → Providers → Email：开发阶段可关闭「Confirm email」，或改用 Magic Link。

也可以用 Supabase CLI：

```bash
supabase link --project-ref <ref>
psql "$SUPABASE_DB_URL" -f packages/supabase/migrations/0001_init.sql
psql "$SUPABASE_DB_URL" -f packages/supabase/seed.sql
```

## 修改种子数据

改 `content/seed/terms.json`、`content/seed/brands.json`、`content/seed/wiki/*.md` 或 `houses/demo-90sqm/*.json` 后：

```bash
pnpm seed:build   # 重新生成 seed.sql，然后在 SQL Editor 重跑
```

## 多租户模型

- 私有：`houses` / `proposals` / `proposal_line_items` / `proposal_assets` — RLS 按 `owner_id = auth.uid()`（含 house 级联判断）。
- 公开示例：`houses.is_public_demo = true` 的房及其方案，匿名可读（获客用）。
- 公共知识：`terms` / `brands` / `wiki_pages` 全员可读；**写入只走 service role**（enrich 流程 / seed），普通用户无写策略，避免脏写。
- `enrich_jobs` 无任何 policy，仅 service role 可访问（审计用）。
