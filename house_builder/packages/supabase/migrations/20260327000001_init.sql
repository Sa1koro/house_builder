-- house_builder phase-1 schema + RLS
-- Private: houses, proposals, proposal_line_items, proposal_assets (auth.uid() = owner)
-- Public read: terms, brands, wiki_pages; writes via service role / enrich

create extension if not exists "pgcrypto";

-- —— profiles ——
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- —— houses ——
create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  city text,
  layout text,
  sales_area_sqm numeric(10, 2),
  billing_area_sqm numeric(10, 2),
  is_public_demo boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists houses_owner_idx on public.houses (owner_id);
create index if not exists houses_demo_idx on public.houses (is_public_demo) where is_public_demo;

alter table public.houses enable row level security;

create policy "houses_select_own_or_demo"
  on public.houses for select
  using (is_public_demo = true or auth.uid() = owner_id);

create policy "houses_insert_own"
  on public.houses for insert
  with check (auth.uid() = owner_id and coalesce(is_public_demo, false) = false);

create policy "houses_update_own"
  on public.houses for update
  using (auth.uid() = owner_id);

create policy "houses_delete_own"
  on public.houses for delete
  using (auth.uid() = owner_id);

-- —— proposals ——
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses (id) on delete cascade,
  owner_id uuid references auth.users (id) on delete cascade,
  company text not null,
  package_name text not null,
  version text not null default '1.0',
  billing_area_sqm numeric(10, 2),
  sales_area_sqm numeric(10, 2),
  costs jsonb not null default '{}'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  source text not null default 'manual'
    check (source in ('seed', 'manual', 'ocr_review', 'import')),
  is_public_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_house_idx on public.proposals (house_id);
create index if not exists proposals_owner_idx on public.proposals (owner_id);

alter table public.proposals enable row level security;

create policy "proposals_select_own_or_demo"
  on public.proposals for select
  using (
    is_public_demo = true
    or auth.uid() = owner_id
    or exists (
      select 1 from public.houses h
      where h.id = proposals.house_id
        and (h.is_public_demo = true or h.owner_id = auth.uid())
    )
  );

create policy "proposals_insert_own"
  on public.proposals for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.houses h
      where h.id = house_id and h.owner_id = auth.uid()
    )
  );

create policy "proposals_update_own"
  on public.proposals for update
  using (auth.uid() = owner_id);

create policy "proposals_delete_own"
  on public.proposals for delete
  using (auth.uid() = owner_id);

-- —— proposal_line_items ——
create table if not exists public.proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  space text not null,
  category text not null,
  spec text not null,
  brands text[] not null default '{}',
  term_slugs text[] not null default '{}',
  qty numeric,
  unit text,
  amount numeric,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pli_proposal_idx on public.proposal_line_items (proposal_id);

alter table public.proposal_line_items enable row level security;

create policy "pli_select_via_proposal"
  on public.proposal_line_items for select
  using (
    exists (
      select 1 from public.proposals p
      where p.id = proposal_line_items.proposal_id
        and (
          p.is_public_demo = true
          or p.owner_id = auth.uid()
          or exists (
            select 1 from public.houses h
            where h.id = p.house_id
              and (h.is_public_demo = true or h.owner_id = auth.uid())
          )
        )
    )
  );

create policy "pli_insert_own"
  on public.proposal_line_items for insert
  with check (
    exists (
      select 1 from public.proposals p
      where p.id = proposal_id and p.owner_id = auth.uid()
    )
  );

create policy "pli_update_own"
  on public.proposal_line_items for update
  using (
    exists (
      select 1 from public.proposals p
      where p.id = proposal_id and p.owner_id = auth.uid()
    )
  );

create policy "pli_delete_own"
  on public.proposal_line_items for delete
  using (
    exists (
      select 1 from public.proposals p
      where p.id = proposal_id and p.owner_id = auth.uid()
    )
  );

-- —— proposal_assets (Vercel Blob) ——
create table if not exists public.proposal_assets (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses (id) on delete cascade,
  proposal_id uuid references public.proposals (id) on delete set null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  blob_url text not null,
  pathname text,
  mime text,
  size_bytes bigint,
  ocr_status text not null default 'pending'
    check (ocr_status in ('pending', 'processing', 'draft', 'reviewed', 'failed')),
  ocr_draft jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pa_owner_idx on public.proposal_assets (owner_id);
create index if not exists pa_house_idx on public.proposal_assets (house_id);

alter table public.proposal_assets enable row level security;

create policy "pa_select_own"
  on public.proposal_assets for select
  using (auth.uid() = owner_id);

create policy "pa_insert_own"
  on public.proposal_assets for insert
  with check (auth.uid() = owner_id);

create policy "pa_update_own"
  on public.proposal_assets for update
  using (auth.uid() = owner_id);

create policy "pa_delete_own"
  on public.proposal_assets for delete
  using (auth.uid() = owner_id);

-- —— terms (public knowledge) ——
create table if not exists public.terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  summary text not null,
  category text,
  source text not null default 'seed'
    check (source in ('seed', 'enrich', 'editor')),
  confidence numeric(3, 2) default 1.0,
  wiki_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists terms_name_idx on public.terms using gin (to_tsvector('simple', name || ' ' || coalesce(array_to_string(aliases, ' '), '')));

alter table public.terms enable row level security;

create policy "terms_select_all"
  on public.terms for select
  using (true);

-- —— brands ——
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  categories text[] not null default '{}',
  tier text not null
    check (tier in ('entry', 'mainstream', 'first_line', 'premium')),
  summary text,
  source text not null default 'seed'
    check (source in ('seed', 'enrich', 'editor')),
  confidence numeric(3, 2) default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brands_tier_idx on public.brands (tier);
create index if not exists brands_categories_idx on public.brands using gin (categories);

alter table public.brands enable row level security;

create policy "brands_select_all"
  on public.brands for select
  using (true);

-- —— wiki_pages ——
create table if not exists public.wiki_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body_md text not null,
  term_slug text references public.terms (slug) on delete set null,
  brand_slug text references public.brands (slug) on delete set null,
  source text not null default 'seed'
    check (source in ('seed', 'enrich', 'editor')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wiki_pages enable row level security;

create policy "wiki_select_public"
  on public.wiki_pages for select
  using (is_public = true);

-- —— enrich_jobs (audit) ——
create table if not exists public.enrich_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('brand', 'term')),
  query text not null,
  provider text not null,
  raw jsonb,
  result_id uuid,
  result_slug text,
  status text not null default 'ok'
    check (status in ('ok', 'error', 'skipped')),
  error text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.enrich_jobs enable row level security;

create policy "enrich_jobs_select_own"
  on public.enrich_jobs for select
  using (created_by is null or auth.uid() = created_by);

-- Authenticated users cannot directly insert into public knowledge tables;
-- enrich APIs use the service role client.
