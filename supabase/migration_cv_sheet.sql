-- =====================================================================
-- Migration: CV Schedule Sheet (Compact) — run on EXISTING databases.
-- Safe to re-run. New installs: schema.sql already contains all of this.
-- =====================================================================

-- profile: sheet settings
alter table public.profile
  add column if not exists status         text default 'open',     -- 'open' | 'busy'
  add column if not exists default_lang   text default 'vi',       -- 'vi' | 'en'
  add column if not exists sheet_id       text default 'CV-01',
  add column if not exists revision       text default '',         -- '' = auto from updated_at
  add column if not exists spine_roles    text default '',
  add column if not exists spine_services text default '';

-- experiences: timeline plotting
alter table public.experiences
  add column if not exists start_year int default 0,               -- 0 = parse from timeframe
  add column if not exists end_year   int;                         -- null = present

-- education: kind + labels
alter table public.education
  add column if not exists start_year int default 0,
  add column if not exists end_year   int,
  add column if not exists kind       text default 'course',       -- 'degree' | 'course'
  add column if not exists short_vi   text default '',
  add column if not exists short_en   text default '',
  add column if not exists issuer     text default '';

-- skills: short label for the sheet
alter table public.skills
  add column if not exists short_title text default '';

-- home_showcase is no longer read by the app; keep or drop as you like:
-- drop table if exists public.home_showcase;

-- ---------------------------------------------------------------------
-- Backfill for the seeded content (matches by name; harmless otherwise)
-- ---------------------------------------------------------------------
update public.profile set
  spine_roles    = coalesce(nullif(spine_roles, ''),    'ARCHITECT · BIM COORDINATOR · BIM MANAGER'),
  spine_services = coalesce(nullif(spine_services, ''), 'BIM MODELING · BIM CONSULTANT · BIM SOLUTION')
where id = 1;

update public.experiences set start_year = 2022, end_year = null where company ilike 'VietNam National Construction Consultants%' and start_year = 0;
update public.experiences set start_year = 2021, end_year = 2022 where company ilike 'DLLC%' and start_year = 0;
update public.experiences set start_year = 2019, end_year = 2021 where company ilike 'EBROS%' and start_year = 0;

update public.education set start_year = 2016, end_year = 2021, kind = 'degree',
  short_vi = 'Cử nhân Kiến trúc', short_en = 'The degree of Architect', issuer = 'Ha Noi Architectural University'
  where name ilike 'Ha Noi Architectural University%' and start_year = 0;
update public.education set start_year = 2023, kind = 'course',
  short_vi = 'Điều phối BIM', short_en = 'BIM Coordinator', issuer = 'Vecas – Autodesk'
  where name ilike 'Vecas – Autodesk%' and start_year = 0;
update public.education set start_year = 2025, kind = 'course',
  short_vi = 'Khóa học GIS', short_en = 'GIS Course', issuer = 'Vecas'
  where name ilike 'Vecas (GIS%' and start_year = 0;

update public.skills set short_title = 'Revit'       where title = 'Autodesk Revit'      and short_title = '';
update public.skills set short_title = 'Navisworks'  where title = 'Autodesk Navisworks' and short_title = '';
update public.skills set short_title = 'Photoshop'   where title = 'Adobe Photoshop'     and short_title = '';
update public.skills set short_title = 'Power BI'    where title = 'Microsoft Power BI'  and short_title = '';
update public.skills set short_title = 'Illustrator' where title = 'Adobe Illustrator'   and short_title = '';
update public.skills set short_title = 'InDesign'    where title = 'Adobe InDesign'      and short_title = '';
update public.skills set short_title = 'MS Office'   where title = 'Microsoft Office'    and short_title = '';
update public.skills set short_title = 'AutoCAD'     where title = 'Autodesk AutoCAD'    and short_title = '';
