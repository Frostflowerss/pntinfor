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
  -- CV sheet settings
  status text default 'open',            -- 'open' | 'busy'
  default_lang text default 'vi',        -- 'vi' | 'en'
  sheet_id text default 'CV-01',
  revision text default '',              -- '' = auto from updated_at
  spine_roles text default '',
  spine_services text default '',
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
  start_year int default 0,              -- 0 = parse from timeframe
  end_year int,                          -- null = present
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- EDUCATION ----------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  description_vi text default '',
  description_en text default '',
  start_year int default 0,
  end_year int,
  kind text default 'course',            -- 'degree' | 'course'
  short_vi text default '',
  short_en text default '',
  issuer text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- SKILLS ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  short_title text default '',
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

do $$
declare t text;
begin
  foreach t in array array[
    'profile','experiences','education','skills',
    'projects','project_images','gallery_images'
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

-- Upgrading an existing database? Run supabase/migration_cv_sheet.sql instead.

-- Seed the single profile row so the admin can edit immediately
insert into public.profile (id) values (1) on conflict (id) do nothing;
