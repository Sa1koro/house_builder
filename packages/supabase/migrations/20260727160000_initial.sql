create extension if not exists pgcrypto;

create type public.brand_tier as enum ('entry', 'mainstream', 'first_line', 'premium');
create type public.knowledge_source as enum ('seed', 'enrich', 'editor');
create type public.ocr_status as enum ('pending', 'processing', 'review_required', 'accepted', 'failed');

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
  usable_area_sqm numeric(8,2),
  pricing_area_sqm numeric(8,2),
  is_public_demo boolean not null default false,
  created_at timestamptz not null default now(),
  constraint house_has_owner_or_demo check (owner_id is not null or is_public_demo)
);
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  company text not null,
  package_name text not null,
  version text,
  pricing jsonb not null default '{}'::jsonb,
  total_amount numeric(12,2),
  draft jsonb,
  created_at timestamptz not null default now()
);
create table public.proposal_line_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  room text not null,
  category text not null,
  item_name text not null,
  brand_name text,
  specification text,
  amount numeric(12,2),
  term_slugs text[] not null default '{}'
);
create table public.proposal_assets (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  blob_url text not null,
  mime_type text not null,
  ocr_status public.ocr_status not null default 'pending',
  created_at timestamptz not null default now()
);
create table public.terms (
  slug text primary key,
  title text not null,
  summary text not null,
  source public.knowledge_source not null,
  confidence numeric(3,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.wiki_pages (
  slug text primary key,
  title text not null,
  body_markdown text not null,
  source public.knowledge_source not null,
  confidence numeric(3,2),
  updated_at timestamptz not null default now()
);
create table public.brands (
  slug text primary key,
  name text not null,
  category text not null,
  tier public.brand_tier not null,
  aliases text[] not null default '{}',
  summary text not null,
  source public.knowledge_source not null,
  confidence numeric(3,2),
  updated_at timestamptz not null default now()
);
create table public.enrich_jobs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  kind text not null check (kind in ('brand', 'term')),
  provider text not null,
  raw jsonb,
  result_slug text,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id) values (new.id) on conflict do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_line_items enable row level security;
alter table public.proposal_assets enable row level security;
alter table public.terms enable row level security;
alter table public.wiki_pages enable row level security;
alter table public.brands enable row level security;
alter table public.enrich_jobs enable row level security;

create policy "read own profile" on public.profiles for select using (id = auth.uid());
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "read own houses or demos" on public.houses for select using (owner_id = auth.uid() or is_public_demo);
create policy "create own houses" on public.houses for insert with check (owner_id = auth.uid() and not is_public_demo);
create policy "change own houses" on public.houses for update using (owner_id = auth.uid()) with check (owner_id = auth.uid() and not is_public_demo);
create policy "delete own houses" on public.houses for delete using (owner_id = auth.uid());
create policy "read accessible proposals" on public.proposals for select using (exists (select 1 from public.houses h where h.id = house_id and (h.owner_id = auth.uid() or h.is_public_demo)));
create policy "write own proposals" on public.proposals for all using (exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())) with check (exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid()));
create policy "read accessible items" on public.proposal_line_items for select using (exists (select 1 from public.proposals p join public.houses h on h.id = p.house_id where p.id = proposal_id and (h.owner_id = auth.uid() or h.is_public_demo)));
create policy "write own items" on public.proposal_line_items for all using (exists (select 1 from public.proposals p join public.houses h on h.id = p.house_id where p.id = proposal_id and h.owner_id = auth.uid())) with check (exists (select 1 from public.proposals p join public.houses h on h.id = p.house_id where p.id = proposal_id and h.owner_id = auth.uid()));
create policy "read own assets" on public.proposal_assets for select using (exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid()));
create policy "write own assets" on public.proposal_assets for all using (exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid())) with check (exists (select 1 from public.houses h where h.id = house_id and h.owner_id = auth.uid()));
create policy "public read terms" on public.terms for select using (true);
create policy "public read wiki" on public.wiki_pages for select using (true);
create policy "public read brands" on public.brands for select using (true);
create policy "no client enrich audit access" on public.enrich_jobs for select using (false);
