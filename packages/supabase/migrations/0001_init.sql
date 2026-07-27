-- house_builder · 0001_init
-- 核心表 + Row Level Security。
-- 应用方式：Supabase Dashboard SQL Editor 粘贴执行，或 `supabase db push` / `psql -f`。

create extension if not exists pgcrypto;

-- ---------- 枚举 ----------

create type brand_tier as enum ('entry', 'mainstream', 'premium', 'luxury'); -- 入门/主流/一线/高端
create type knowledge_source as enum ('seed', 'enrich', 'editor');
create type ocr_status as enum ('pending', 'processing', 'draft_ready', 'reviewed', 'failed');
create type proposal_status as enum ('draft', 'confirmed');
create type enrich_kind as enum ('brand', 'term');
create type enrich_status as enum ('hit', 'enriched', 'placeholder', 'failed');

-- ---------- 用户资料 ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- 注册时自动建 profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 私有数据：房屋 / 方案 / 明细 / 原件 ----------

create table public.houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  city text,
  layout text,
  sales_area_sqm numeric,      -- 房产商售卖面积（建筑面积）
  billing_area_sqm numeric,    -- 计价面积
  is_public_demo boolean not null default false,
  created_at timestamptz not null default now(),
  -- 公开示例房 owner 可为空（系统预置）；普通房必须有 owner
  constraint houses_owner_or_demo check (owner_id is not null or is_public_demo)
);
create index houses_owner_idx on public.houses (owner_id);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses (id) on delete cascade,
  company text not null,
  package_name text not null,
  version text,
  status proposal_status not null default 'confirmed',
  source text not null default 'manual', -- manual / ocr / demo
  pricing jsonb not null default '{"currency":"CNY","items":[]}'::jsonb,
  total_base numeric,
  total_with_fees numeric,
  notes text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index proposals_house_idx on public.proposals (house_id);

create table public.proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  position int not null default 0,
  space text not null,          -- 客餐厅 / 厨房 / 卧室 / 阳台 / 卫生间 / 辅材 ...
  category text not null,       -- 地砖+踢脚线 / 腻子基层 ...
  brand_names text[] not null default '{}',
  spec text,
  note text,
  term_slugs text[] not null default '{}'
);
create index pli_proposal_idx on public.proposal_line_items (proposal_id);

create table public.proposal_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  house_id uuid not null references public.houses (id) on delete cascade,
  proposal_id uuid references public.proposals (id) on delete set null,
  blob_url text not null,       -- Vercel Blob URL
  pathname text,
  mime text,
  size_bytes bigint,
  ocr_status ocr_status not null default 'pending',
  ocr_draft jsonb,              -- 本地 worker 推回的 draft Proposal JSON
  ocr_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index assets_house_idx on public.proposal_assets (house_id);
create index assets_owner_idx on public.proposal_assets (owner_id);

-- ---------- 公共知识：名词 / Wiki / 品牌 ----------

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_def text not null,
  aliases text[] not null default '{}',
  source knowledge_source not null default 'seed',
  confidence numeric not null default 1 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index terms_name_idx on public.terms (name);

create table public.wiki_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  term_slug text references public.terms (slug) on delete set null,
  title text not null,
  body_md text not null,
  status text not null default 'published', -- published / draft
  source knowledge_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  categories text[] not null default '{}',
  tier brand_tier not null default 'mainstream',
  one_liner text,
  country text,
  source knowledge_source not null default 'seed',
  confidence numeric not null default 1 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index brands_name_idx on public.brands (name);
create index brands_categories_idx on public.brands using gin (categories);

-- ---------- 补全审计 ----------

create table public.enrich_jobs (
  id uuid primary key default gen_random_uuid(),
  kind enrich_kind not null,
  query text not null,
  provider text,                -- db-hit / tavily+llm / llm / placeholder
  status enrich_status not null,
  raw jsonb,                    -- 外搜/LLM 原始返回，便于审计与重跑
  result_id uuid,               -- 命中/写入的 brands.id 或 terms.id
  created_at timestamptz not null default now()
);
create index enrich_jobs_query_idx on public.enrich_jobs (kind, query);

-- ---------- Row Level Security ----------

alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_line_items enable row level security;
alter table public.proposal_assets enable row level security;
alter table public.terms enable row level security;
alter table public.wiki_pages enable row level security;
alter table public.brands enable row level security;
alter table public.enrich_jobs enable row level security;

-- profiles：只能看/改自己
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- houses：自己的 + 公开示例房（未登录也可读示例）
create policy "houses_select_own_or_demo" on public.houses
  for select using (is_public_demo or owner_id = auth.uid());
create policy "houses_insert_own" on public.houses
  for insert with check (owner_id = auth.uid());
create policy "houses_update_own" on public.houses
  for update using (owner_id = auth.uid());
create policy "houses_delete_own" on public.houses
  for delete using (owner_id = auth.uid());

-- proposals：跟随所属 house 的可见性
create policy "proposals_select_visible_house" on public.proposals
  for select using (
    exists (
      select 1 from public.houses h
      where h.id = house_id and (h.is_public_demo or h.owner_id = auth.uid())
    )
  );
create policy "proposals_insert_own_house" on public.proposals
  for insert with check (
    exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
  );
create policy "proposals_update_own_house" on public.proposals
  for update using (
    exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
  );
create policy "proposals_delete_own_house" on public.proposals
  for delete using (
    exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
  );

-- proposal_line_items：跟随所属 proposal
create policy "pli_select_visible" on public.proposal_line_items
  for select using (
    exists (
      select 1 from public.proposals p
      join public.houses h on h.id = p.house_id
      where p.id = proposal_id and (h.is_public_demo or h.owner_id = auth.uid())
    )
  );
create policy "pli_insert_own" on public.proposal_line_items
  for insert with check (
    exists (
      select 1 from public.proposals p
      join public.houses h on h.id = p.house_id
      where p.id = proposal_id and h.owner_id = auth.uid()
    )
  );
create policy "pli_update_own" on public.proposal_line_items
  for update using (
    exists (
      select 1 from public.proposals p
      join public.houses h on h.id = p.house_id
      where p.id = proposal_id and h.owner_id = auth.uid()
    )
  );
create policy "pli_delete_own" on public.proposal_line_items
  for delete using (
    exists (
      select 1 from public.proposals p
      join public.houses h on h.id = p.house_id
      where p.id = proposal_id and h.owner_id = auth.uid()
    )
  );

-- proposal_assets：仅 owner 可见可写（demo 房的原件也只有系统可管理）
create policy "assets_select_own" on public.proposal_assets
  for select using (owner_id = auth.uid());
create policy "assets_insert_own" on public.proposal_assets
  for insert with check (
    owner_id = auth.uid()
    and exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
  );
create policy "assets_update_own" on public.proposal_assets
  for update using (owner_id = auth.uid());
create policy "assets_delete_own" on public.proposal_assets
  for delete using (owner_id = auth.uid());

-- 公共知识：全员（含匿名）可读；写入只走 service role（绕过 RLS），避免脏写
create policy "terms_select_all" on public.terms for select using (true);
create policy "wiki_select_published" on public.wiki_pages for select using (status = 'published');
create policy "brands_select_all" on public.brands for select using (true);

-- enrich_jobs：不开任何 policy，仅 service role 可读写
