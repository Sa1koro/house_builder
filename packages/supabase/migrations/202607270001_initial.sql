create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.brand_tier as enum ('入门', '主流', '一线', '高端');
create type public.asset_status as enum ('uploaded', 'processing', 'review', 'confirmed', 'failed');
create type public.content_source as enum ('seed', 'enrich', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  city text,
  layout text,
  sale_area numeric(10,2),
  pricing_area numeric(10,2),
  is_public_demo boolean not null default false,
  created_at timestamptz not null default now(),
  constraint private_house_has_owner check (is_public_demo or owner_id is not null)
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  company text not null,
  package_name text not null,
  version text not null default '1.0',
  currency text not null default 'CNY' check (currency = 'CNY'),
  costs jsonb not null default '{}'::jsonb,
  status asset_status not null default 'review',
  created_at timestamptz not null default now()
);

create table public.proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  sort_order integer not null default 0,
  space text not null,
  category text not null,
  specification text not null default '',
  brands text[] not null default '{}',
  term_slugs text[] not null default '{}',
  notes text
);

create table public.proposal_assets (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  blob_url text not null,
  pathname text not null,
  mime_type text not null,
  ocr_status asset_status not null default 'uploaded',
  ocr_draft jsonb,
  created_at timestamptz not null default now()
);

create table public.compare_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  house_id uuid not null references public.houses(id) on delete cascade,
  proposal_ids uuid[] not null,
  created_at timestamptz not null default now()
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  aliases text[] not null default '{}',
  source content_source not null default 'seed',
  confidence numeric(4,3) not null default 1 check (confidence between 0 and 1),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  tier brand_tier not null default '主流',
  summary text not null,
  aliases text[] not null default '{}',
  source content_source not null default 'seed',
  confidence numeric(4,3) not null default 1 check (confidence between 0 and 1),
  updated_at timestamptz not null default now()
);

create table public.wiki_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('term', 'brand')),
  entity_id uuid,
  body_md text not null,
  source content_source not null default 'seed',
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.enrich_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('term', 'brand')),
  query text not null,
  provider text not null,
  raw jsonb,
  result_id uuid,
  status text not null check (status in ('hit', 'created', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

create index houses_owner_idx on public.houses(owner_id);
create index proposals_house_idx on public.proposals(house_id);
create index proposal_line_items_proposal_idx on public.proposal_line_items(proposal_id);
create index brands_search_idx on public.brands using gin ((name || ' ' || array_to_string(aliases, ' ')) gin_trgm_ops);
create index terms_search_idx on public.terms using gin ((name || ' ' || array_to_string(aliases, ' ')) gin_trgm_ops);

alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_line_items enable row level security;
alter table public.proposal_assets enable row level security;
alter table public.compare_sessions enable row level security;
alter table public.terms enable row level security;
alter table public.brands enable row level security;
alter table public.wiki_pages enable row level security;
alter table public.enrich_jobs enable row level security;

create policy "profiles read own" on public.profiles for select using (id = auth.uid());
create policy "profiles update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "houses read own or demo" on public.houses for select using (owner_id = auth.uid() or is_public_demo);
create policy "houses insert own" on public.houses for insert with check (owner_id = auth.uid() and not is_public_demo);
create policy "houses update own" on public.houses for update using (owner_id = auth.uid()) with check (owner_id = auth.uid() and not is_public_demo);
create policy "houses delete own" on public.houses for delete using (owner_id = auth.uid());

create policy "proposals read through house" on public.proposals for select using (
  exists (select 1 from public.houses h where h.id = house_id and (h.owner_id = auth.uid() or h.is_public_demo))
);
create policy "proposals insert through owned house" on public.proposals for insert with check (
  exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
);
create policy "proposals update through owned house" on public.proposals for update using (
  exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
);
create policy "proposals delete through owned house" on public.proposals for delete using (
  exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())
);

create policy "line items read through proposal" on public.proposal_line_items for select using (
  exists (
    select 1 from public.proposals p join public.houses h on h.id = p.house_id
    where p.id = proposal_id and (h.owner_id = auth.uid() or h.is_public_demo)
  )
);
create policy "line items insert through owned proposal" on public.proposal_line_items for insert with check (
  exists (
    select 1 from public.proposals p join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);
create policy "line items update through owned proposal" on public.proposal_line_items for update using (
  exists (
    select 1 from public.proposals p join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);
create policy "line items delete through owned proposal" on public.proposal_line_items for delete using (
  exists (
    select 1 from public.proposals p join public.houses h on h.id = p.house_id
    where p.id = proposal_id and h.owner_id = auth.uid()
  )
);

create policy "assets own only" on public.proposal_assets for select using (owner_id = auth.uid());
create policy "assets insert own house" on public.proposal_assets for insert with check (
  owner_id = auth.uid() and exists (
    select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid()
  )
);
create policy "assets update own" on public.proposal_assets for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "assets delete own" on public.proposal_assets for delete using (owner_id = auth.uid());

create policy "compare sessions own" on public.compare_sessions for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "public terms readable" on public.terms for select using (true);
create policy "public brands readable" on public.brands for select using (true);
create policy "published wiki readable" on public.wiki_pages for select using (is_published);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
