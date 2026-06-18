import "server-only";
import { getAdminClient } from "@/lib/supabase";
import {
  type Profile,
  type Experience,
  type Education,
  type Skill,
  type Project,
  type GalleryImage,
} from "@/lib/types";
import { fallbackData } from "@/lib/fallback";

/* eslint-disable @typescript-eslint/no-explicit-any */
const arr = (v: any): string[] => (Array.isArray(v) ? v : []);

export async function adminGetProfile(): Promise<Profile> {
  const c = getAdminClient();
  if (!c) return fallbackData.profile;
  const { data } = await c.from("profile").select("*").eq("id", 1).maybeSingle();
  if (!data) return fallbackData.profile;
  return {
    name: data.name ?? "",
    role: data.role ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    addressVI: data.address_vi ?? "",
    addressEN: data.address_en ?? "",
    locationLabel: data.location_label ?? "",
    languages: arr(data.languages),
    avatarUrl: data.avatar_url ?? "",
    cvUrl: data.cv_url ?? "",
    summaryVI: data.summary_vi ?? "",
    summaryEN: data.summary_en ?? "",
    homeHeadlineVI: data.home_headline_vi ?? "",
    homeHeadlineEN: data.home_headline_en ?? "",
    homeSublineVI: data.home_subline_vi ?? "",
    homeSublineEN: data.home_subline_en ?? "",
  };
}

export async function adminGetExperiences(): Promise<Experience[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c.from("experiences").select("*").order("sort_order");
  return (data ?? []).map((r: any) => ({
    id: r.id,
    company: r.company ?? "",
    timeframe: r.timeframe ?? "",
    roleVI: r.role_vi ?? "",
    roleEN: r.role_en ?? "",
    achievementsVI: arr(r.achievements_vi),
    achievementsEN: arr(r.achievements_en),
    sortOrder: r.sort_order ?? 0,
  }));
}

export async function adminGetEducation(): Promise<Education[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c.from("education").select("*").order("sort_order");
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name ?? "",
    descriptionVI: r.description_vi ?? "",
    descriptionEN: r.description_en ?? "",
    sortOrder: r.sort_order ?? 0,
  }));
}

export async function adminGetSkills(): Promise<Skill[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c.from("skills").select("*").order("sort_order");
  return (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title ?? "",
    level: r.level ?? "Skillful",
    percent: r.percent ?? 50,
    sortOrder: r.sort_order ?? 0,
  }));
}

export async function adminGetProjects(): Promise<Project[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c
    .from("projects")
    .select("*, project_images(*)")
    .order("sort_order");
  return (data ?? []).map((r: any) => ({
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
      .map((i: any) => ({ id: i.id, url: i.url, sortOrder: i.sort_order ?? 0 }))
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder),
    sortOrder: r.sort_order ?? 0,
  }));
}

export async function adminGetProject(id: string): Promise<Project | null> {
  const list = await adminGetProjects();
  return list.find((p) => p.id === id) ?? null;
}

export async function adminGetGallery(): Promise<GalleryImage[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c.from("gallery_images").select("*").order("sort_order");
  return (data ?? []).map((r: any) => ({
    id: r.id,
    url: r.url ?? "",
    alt: r.alt ?? "",
    orientation: r.orientation === "vertical" ? "vertical" : "horizontal",
    sortOrder: r.sort_order ?? 0,
  }));
}
