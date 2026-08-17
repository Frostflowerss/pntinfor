import "server-only";
import { getAdminClient } from "@/lib/supabase";
import { fallbackData } from "@/lib/fallback";
import {
  mapProfile,
  mapExperience,
  mapEducation,
  mapSkill,
  mapProject,
  mapGallery,
} from "@/lib/mappers";
import type { Profile, Experience, Education, Skill, Project, GalleryImage } from "@/lib/types";

/** Studio reads bypass RLS and the public cache so edits show up immediately. */
async function rows<T>(table: string, select: string, map: (r: unknown) => T): Promise<T[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data } = await c.from(table).select(select).order("sort_order");
  return (data ?? []).map((r) => map(r));
}

export async function adminGetProfile(): Promise<Profile> {
  const c = getAdminClient();
  if (!c) return fallbackData.profile;
  const { data } = await c.from("profile").select("*").eq("id", 1).maybeSingle();
  return data ? mapProfile(data) : fallbackData.profile;
}

export const adminGetExperiences = () => rows<Experience>("experiences", "*", mapExperience);
export const adminGetEducation = () => rows<Education>("education", "*", mapEducation);
export const adminGetSkills = () => rows<Skill>("skills", "*", mapSkill);
export const adminGetProjects = () => rows<Project>("projects", "*, project_images(*)", mapProject);
export const adminGetGallery = () => rows<GalleryImage>("gallery_images", "*", mapGallery);

export async function adminGetProject(id: string): Promise<Project | null> {
  const c = getAdminClient();
  if (!c) return null;
  const { data } = await c
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();
  return data ? mapProject(data) : null;
}
