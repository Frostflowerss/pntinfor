-- Migration: featured project selection + image aspect ratio
-- Run this on existing Supabase projects (safe to re-run).

alter table public.projects add column if not exists featured       boolean default false;
alter table public.projects add column if not exists featured_order int     default 0;
alter table public.projects add column if not exists aspect         text    default '';   -- '' = dùng tỉ lệ mặc định của trang

alter table public.profile  add column if not exists card_aspect    text    default '16/11'; -- tỉ lệ mặc định cho card ở mục 01
