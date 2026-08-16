/**
 * Single source of truth for mapping Supabase rows → app types.
 * Used by both the public reader (data.ts) and the studio reader (admin-data.ts).
 */
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  GalleryImage,
  Lang,
  WorkStatus,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const arr = (v: any): string[] => (Array.isArray(v) ? v.filter(Boolean) : []);
const num = (v: any, d = 0): number => (Number.isFinite(Number(v)) ? Number(v) : d);
const yearOrNull = (v: any): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 1900 ? n : null;
};

export function mapProfile(r: any): Profile {
  return {
    name: r.name ?? "",
    role: r.role ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    addressVI: r.address_vi ?? "",
    addressEN: r.address_en ?? "",
    locationLabel: r.location_label ?? "",
    languages: arr(r.languages),
    avatarUrl: r.avatar_url ?? "",
    cvUrl: r.cv_url ?? "",
    summaryVI: r.summary_vi ?? "",
    summaryEN: r.summary_en ?? "",
    homeHeadlineVI: r.home_headline_vi ?? "",
    homeHeadlineEN: r.home_headline_en ?? "",
    homeSublineVI: r.home_subline_vi ?? "",
    homeSublineEN: r.home_subline_en ?? "",
    accent: r.accent || "#5c8cff",
    enColor: r.en_color ?? "",
    cardAspect: r.card_aspect || "16/11",
    status: (r.status === "busy" ? "busy" : "open") as WorkStatus,
    defaultLang: (r.default_lang === "en" ? "en" : "vi") as Lang,
    sheetId: r.sheet_id || "CV-01",
    revision: r.revision ?? "",
    spineRoles: r.spine_roles ?? "",
    spineServices: r.spine_services ?? "",
    updatedAt: r.updated_at ?? "",
  };
}

export const mapExperience = (r: any): Experience => ({
  id: r.id,
  company: r.company ?? "",
  timeframe: r.timeframe ?? "",
  roleVI: r.role_vi ?? "",
  roleEN: r.role_en ?? "",
  achievementsVI: arr(r.achievements_vi),
  achievementsEN: arr(r.achievements_en),
  startYear: num(r.start_year, 0),
  endYear: yearOrNull(r.end_year),
  sortOrder: num(r.sort_order),
});

export const mapEducation = (r: any): Education => ({
  id: r.id,
  name: r.name ?? "",
  descriptionVI: r.description_vi ?? "",
  descriptionEN: r.description_en ?? "",
  startYear: num(r.start_year, 0),
  endYear: yearOrNull(r.end_year),
  kind: r.kind === "degree" ? "degree" : "course",
  shortVI: r.short_vi ?? "",
  shortEN: r.short_en ?? "",
  issuer: r.issuer ?? "",
  sortOrder: num(r.sort_order),
});

export const mapSkill = (r: any): Skill => ({
  id: r.id,
  title: r.title ?? "",
  shortTitle: r.short_title ?? "",
  level: r.level ?? "Skillful",
  percent: num(r.percent, 50),
  sortOrder: num(r.sort_order),
});

export const mapProject = (r: any): Project => ({
  id: r.id,
  slug: r.slug ?? r.id,
  titleVI: r.title_vi ?? "",
  titleEN: r.title_en ?? "",
  constructionClassVI: r.construction_class_vi ?? "",
  constructionClassEN: r.construction_class_en ?? "",
  locationVI: r.location_vi ?? "",
  locationEN: r.location_en ?? "",
  primaryRoleVI: r.primary_role_vi ?? "",
  primaryRoleEN: r.primary_role_en ?? "",
  overviewVI: r.overview_vi ?? "",
  overviewEN: r.overview_en ?? "",
  responsibilitiesVI: arr(r.responsibilities_vi),
  responsibilitiesEN: arr(r.responsibilities_en),
  coverUrl: r.cover_url ?? "",
  images: (r.project_images ?? [])
    .map((i: any) => ({ id: i.id, url: i.url, sortOrder: num(i.sort_order) }))
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder),
  featured: r.featured ?? false,
  featuredOrder: num(r.featured_order),
  aspect: r.aspect ?? "",
  sortOrder: num(r.sort_order),
});

export const mapGallery = (r: any): GalleryImage => ({
  id: r.id,
  url: r.url ?? "",
  alt: r.alt ?? "",
  orientation: r.orientation === "vertical" ? "vertical" : "horizontal",
  sortOrder: num(r.sort_order),
});
