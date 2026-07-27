-- House Builder: core schema + RLS

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- Enums
create type brand_tier as enum ('entry', 'mainstream', 'first_tier', 'premium');
create type enrich_entity_type as enum ('brand', 'term');
create type enrich_provider as enum ('mock', 'search', 'llm');
create type asset_ocr_status as enum ('pending', 'processing', 'draft_ready', 'reviewed', 'failed');
create type wiki_source as enum ('seed', 'enrich', 'editor');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Houses
create table public.houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  city text,
  sales_area_sqm numeric(10, 2),
  pricing_area_sqm numeric(10, 2) not null,
  layout text,
  is_public_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposals
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  company text not null,
  package_name text not null,
  version text,
  pricing jsonb not null default '{}',
  notes jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposal line items
create table public.proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  space text not null,
  category text not null,
  brands text not null,
  spec text,
  term_slugs text[] default '{}',
  notes text,
  sort_order int not null default 0
);

-- Proposal assets (Blob originals)
create table public.proposal_assets (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references public.proposals(id) on delete set null,
  house_id uuid not null references public.houses(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  blob_url text not null,
  mime_type text,
  file_name text,
  ocr_status asset_ocr_status not null default 'pending',
  draft_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Terms (public knowledge)
create table public.terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  definition text not null,
  category text,
  aliases text[] default '{}',
  source wiki_source not null default 'seed',
  confidence numeric(3, 2) default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brands (public knowledge)
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  categories text[] not null default '{}',
  tier brand_tier not null default 'mainstream',
  aliases text[] default '{}',
  summary text,
  source wiki_source not null default 'seed',
  confidence numeric(3, 2) default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Wiki pages
create table public.wiki_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  term_slug text references public.terms(slug) on delete set null,
  brand_slug text references public.brands(slug) on delete set null,
  source wiki_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enrich audit jobs
create table public.enrich_jobs (
  id uuid primary key default gen_random_uuid(),
  entity_type enrich_entity_type not null,
  query text not null,
  provider enrich_provider not null default 'mock',
  raw_response jsonb,
  result_slug text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Indexes
create index houses_owner_id_idx on public.houses(owner_id);
create index houses_public_demo_idx on public.houses(is_public_demo) where is_public_demo = true;
create index proposals_house_id_idx on public.proposals(house_id);
create index proposal_line_items_proposal_id_idx on public.proposal_line_items(proposal_id);
create index proposal_assets_house_id_idx on public.proposal_assets(house_id);
create index proposal_assets_owner_id_idx on public.proposal_assets(owner_id);
create index terms_slug_idx on public.terms(slug);
create index brands_slug_idx on public.brands(slug);
create index brands_name_trgm on public.brands using gin (name gin_trgm_ops);
create index wiki_pages_slug_idx on public.wiki_pages(slug);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger houses_updated_at before update on public.houses
  for each row execute function public.set_updated_at();
create trigger proposals_updated_at before update on public.proposals
  for each row execute function public.set_updated_at();
create trigger proposal_assets_updated_at before update on public.proposal_assets
  for each row execute function public.set_updated_at();
create trigger terms_updated_at before update on public.terms
  for each row execute function public.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();
create trigger wiki_pages_updated_at before update on public.wiki_pages
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_line_items enable row level security;
alter table public.proposal_assets enable row level security;
alter table public.terms enable row level security;
alter table public.brands enable row level security;
alter table public.wiki_pages enable row level security;
alter table public.enrich_jobs enable row level security;

-- Profiles: own row only
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Houses: owner or public demo
create policy "houses_select" on public.houses for select using (
  is_public_demo = true or auth.uid() = owner_id
);
create policy "houses_insert" on public.houses for insert with check (auth.uid() = owner_id);
create policy "houses_update" on public.houses for update using (auth.uid() = owner_id);
create policy "houses_delete" on public.houses for delete using (auth.uid() = owner_id);

-- Proposals: via house access
create policy "proposals_select" on public.proposals for select using (
  exists (
    select 1 from public.houses h
    where h.id = house_id and (h.is_public_demo = true or h.owner_id = auth.uid())
  )
);
create policy "proposals_insert" on public.proposals for insert with check (
  exists (
    select 1 from public.houses h
    where h.id = house_id and h.owner_id = auth.uid()
  )
);
create policy "proposals_update" on public.proposals for update using (
  exists (
    select 1 from public.houses h
    where h.id = house_id and h.owner_id = auth.uid()
  )
);
create policy "proposals_delete" on public.proposals for delete using (
  exists (
    select 1 from public.houses h
    where h.id = house_id and h.owner_id = auth.uid()
  )
);

-- Line items: via proposal/house
create policy "line_items_select" on public.proposal_line_items for select using (
  exists (
    select 1 from public.proposals p
    join public.houses h on h.id = p.house_id
    where p.id = proposal_id and (h.is_public_demo = true or h.owner_id = auth.uid())
  )
);
create policy "line_items_insert" on public.proposal_line_items for insert with check (
  exists (
    select 1 from public.proposals p
    join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);
create policy "line_items_update" on public.proposal_line_items for update using (
  exists (
    select 1 from public.proposals p
    join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);
create policy "line_items_delete" on public.proposal_line_items for delete using (
  exists (
    select 1 from public.proposals p
    join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);

-- Assets: owner only for write; read via house
create policy "assets_select" on public.proposal_assets for select using (
  auth.uid() = owner_id or exists (
    select 1 from public.houses h
    where h.id = house_id and (h.is_public_demo = true or h.owner_id = auth.uid())
  )
);
create policy "assets_insert" on public.proposal_assets for insert with check (auth.uid() = owner_id);
create policy "assets_update" on public.proposal_assets for update using (auth.uid() = owner_id);
create policy "assets_delete" on public.proposal_assets for delete using (auth.uid() = owner_id);

-- Public knowledge: read all, no direct client writes
create policy "terms_select_all" on public.terms for select using (true);
create policy "brands_select_all" on public.brands for select using (true);
create policy "wiki_select_all" on public.wiki_pages for select using (true);
create policy "enrich_jobs_select_own" on public.enrich_jobs for select using (auth.uid() = created_by);
