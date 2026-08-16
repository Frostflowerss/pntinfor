-- Migration: configurable Home avatar frame aspect ratio
alter table public.profile add column if not exists avatar_aspect text default '4/5';
