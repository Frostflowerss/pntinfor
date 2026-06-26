-- =====================================================================
-- PNT ARCH portfolio — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------- PROFILE (single row, id = 1) ----------
create table if not exists public.profile (
  id int primary key default 1,
  name text default '',
  role text default '',
  email text default '',
  phone text default '',
  address_vi text default '',
  address_en text default '',
  location_label text default '',
  languages text[] default '{}',
  avatar_url text default '',
  cv_url text default '',
  summary_vi text default '',
  summary_en text default '',
  home_headline_vi text default '',
  home_headline_en text default '',
  home_subline_vi text default '',
  home_subline_en text default '',
  accent text default '#5c8cff',
  en_color text default '',
  card_aspect text default '16/11',
  updated_at timestamptz default now(),
  constraint profile_singleton check (id = 1)
);

-- ---------- EXPERIENCES ----------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text default '',
  timeframe text default '',
  role_vi text default '',
  role_en text default '',
  achievements_vi text[] default '{}',
  achievements_en text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- EDUCATION ----------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  description_vi text default '',
  description_en text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- SKILLS ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  level text default 'Skillful',
  percent int default 50,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_vi text default '',
  title_en text default '',
  construction_class_vi text default '',
  construction_class_en text default '',
  location_vi text default '',
  location_en text default '',
  primary_role_vi text default '',
  primary_role_en text default '',
  overview_vi text default '',
  overview_en text default '',
  responsibilities_vi text[] default '{}',
  responsibilities_en text[] default '{}',
  cover_url text default '',
  featured boolean default false,
  featured_order int default 0,
  aspect text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- PROJECT IMAGES ----------
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  sort_order int default 0
);
create index if not exists project_images_project_idx on public.project_images(project_id);

-- ---------- GALLERY ----------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text default '',
  orientation text default 'horizontal',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- HOME SHOWCASE (optional) ----------
create table if not exists public.home_showcase (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  sort_order int default 0
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public can READ everything. Writes go through the service role key
-- (server-side only, after admin login) which BYPASSES RLS.
-- =====================================================================
alter table public.profile        enable row level security;
alter table public.experiences    enable row level security;
alter table public.education      enable row level security;
alter table public.skills         enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.gallery_images enable row level security;
alter table public.home_showcase  enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'profile','experiences','education','skills',
    'projects','project_images','gallery_images','home_showcase'
  ]
  loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$s;', t);
    execute format('create policy "public_read_%1$s" on public.%1$s for select using (true);', t);
  end loop;
end $$;

-- =====================================================================
-- STORAGE bucket "portfolio" (public read)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio');

-- Safe upgrade for existing databases (color controls)
alter table public.profile
  add column if not exists accent text default '#5c8cff',
  add column if not exists en_color text default '';

-- Seed the single profile row so the admin can edit immediately
insert into public.profile (id) values (1) on conflict (id) do nothing;
