import { getPublicClient, isSupabaseConfigured } from "./supabase";
import { fallbackData } from "./fallback";
import {
  mapProfile,
  mapExperience,
  mapEducation,
  mapSkill,
  mapProject,
  mapGallery,
} from "./mappers";
import type { SiteData, Project } from "./types";

/**
 * Small in-process cache so one request → at most one round of Supabase queries.
 * Pages additionally use ISR (`revalidate = 60`); studio writes call clearSiteCache().
 */
let cache: { data: SiteData; at: number } | null = null;
const TTL = 30_000;

export async function getSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured) return fallbackData;
  if (cache && Date.now() - cache.at < TTL) return cache.data;

  const supabase = getPublicClient();
  if (!supabase) return fallbackData;

  try {
    const [profile, experiences, education, skills, projects, gallery] = await Promise.all([
      supabase.from("profile").select("*").limit(1).single(),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("education").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("projects").select("*, project_images(*)").order("sort_order"),
      supabase.from("gallery_images").select("*").order("sort_order"),
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
