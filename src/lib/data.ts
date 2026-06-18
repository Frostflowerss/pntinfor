import { getPublicClient, isSupabaseConfigured } from "./supabase";
import { fallbackData } from "./fallback";
import type {
  SiteData,
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  GalleryImage,
  HomeShowcaseImage,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const arr = (v: any): string[] => (Array.isArray(v) ? v.filter(Boolean) : []);

function mapProfile(r: any): Profile {
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
  };
}

const mapExperience = (r: any): Experience => ({
  id: r.id,
  company: r.company ?? "",
  timeframe: r.timeframe ?? "",
  roleVI: r.role_vi ?? "",
  roleEN: r.role_en ?? "",
  achievementsVI: arr(r.achievements_vi),
  achievementsEN: arr(r.achievements_en),
  sortOrder: r.sort_order ?? 0,
});

const mapEducation = (r: any): Education => ({
  id: r.id,
  name: r.name ?? "",
  descriptionVI: r.description_vi ?? "",
  descriptionEN: r.description_en ?? "",
  sortOrder: r.sort_order ?? 0,
});

const mapSkill = (r: any): Skill => ({
  id: r.id,
  title: r.title ?? "",
  level: r.level ?? "Skillful",
  percent: r.percent ?? 50,
  sortOrder: r.sort_order ?? 0,
});

const mapProject = (r: any): Project => ({
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
});

const mapGallery = (r: any): GalleryImage => ({
  id: r.id,
  url: r.url ?? "",
  alt: r.alt ?? "",
  orientation: r.orientation === "vertical" ? "vertical" : "horizontal",
  sortOrder: r.sort_order ?? 0,
});

const mapShowcase = (r: any): HomeShowcaseImage => ({
  id: r.id,
  url: r.url ?? "",
  sortOrder: r.sort_order ?? 0,
});

let cache: { data: SiteData; at: number } | null = null;
const TTL = 30_000;

export async function getSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured) return fallbackData;
  if (cache && Date.now() - cache.at < TTL) return cache.data;

  const supabase = getPublicClient();
  if (!supabase) return fallbackData;

  try {
    const [profile, experiences, education, skills, projects, gallery, showcase] =
      await Promise.all([
        supabase.from("profile").select("*").limit(1).single(),
        supabase.from("experiences").select("*").order("sort_order"),
        supabase.from("education").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase
          .from("projects")
          .select("*, project_images(*)")
          .order("sort_order"),
        supabase.from("gallery_images").select("*").order("sort_order"),
        supabase.from("home_showcase").select("*").order("sort_order"),
      ]);

    const data: SiteData = {
      profile: profile.data ? mapProfile(profile.data) : fallbackData.profile,
      experiences: experiences.data?.length
        ? experiences.data.map(mapExperience)
        : fallbackData.experiences,
      education: education.data?.length
        ? education.data.map(mapEducation)
        : fallbackData.education,
      skills: skills.data?.length ? skills.data.map(mapSkill) : fallbackData.skills,
      projects: projects.data?.length ? projects.data.map(mapProject) : fallbackData.projects,
      gallery: gallery.data?.map(mapGallery) ?? [],
      homeShowcase: showcase.data?.map(mapShowcase) ?? [],
    };
    cache = { data, at: Date.now() };
    return data;
  } catch {
    return fallbackData;
  }
}

export function clearSiteCache() {
  cache = null;
}

export async function getProject(slug: string): Promise<Project | null> {
  const data = await getSiteData();
  return data.projects.find((p) => p.slug === slug) ?? null;
}
