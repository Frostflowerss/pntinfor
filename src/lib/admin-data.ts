import "server-only";
import { getAdminClient } from "@/lib/supabase";
import {
  mapProfile,
  mapExperience,
  mapEducation,
  mapSkill,
  mapProject,
  mapGallery,
} from "@/lib/mappers";
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  GalleryImage,
} from "@/lib/types";
import { fallbackData } from "@/lib/fallback";

/**
 * Đọc dữ liệu cho panel quản trị (dùng service role, bỏ qua RLS).
 *
 * Toàn bộ phần chuyển đổi dòng dữ liệu đã chuyển sang lib/mappers.ts — trước
 * đây file này giữ một bản sao gần như nguyên văn của data.ts, khoảng 120 dòng
 * trùng lặp và đã bắt đầu lệch nhau.
 */

export async function adminGetProfile(): Promise<Profile> {
  const c = getAdminClient();
  if (!c) return fallbackData.profile;
  const { data, error } = await c.from("profile").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("[admin-data] adminGetProfile:", error.message);
  if (!data) return fallbackData.profile;
  return mapProfile(data);
}

export async function adminGetExperiences(): Promise<Experience[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data, error } = await c.from("experiences").select("*").order("sort_order");
  if (error) console.error("[admin-data] adminGetExperiences:", error.message);
  return (data ?? []).map(mapExperience);
}

export async function adminGetEducation(): Promise<Education[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data, error } = await c.from("education").select("*").order("sort_order");
  if (error) console.error("[admin-data] adminGetEducation:", error.message);
  return (data ?? []).map(mapEducation);
}

export async function adminGetSkills(): Promise<Skill[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data, error } = await c.from("skills").select("*").order("sort_order");
  if (error) console.error("[admin-data] adminGetSkills:", error.message);
  return (data ?? []).map(mapSkill);
}

export async function adminGetProjects(): Promise<Project[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data, error } = await c
    .from("projects")
    .select("*, project_images(*)")
    .order("sort_order");
  if (error) console.error("[admin-data] adminGetProjects:", error.message);
  return (data ?? []).map(mapProject);
}

/**
 * Lấy một dự án theo id.
 * Trước đây hàm này gọi adminGetProjects() rồi .find() — tức là kéo TOÀN BỘ
 * bảng projects kèm join project_images chỉ để lấy một dòng, và trang sửa dự án
 * chạy nó hai lần mỗi lần tải.
 */
export async function adminGetProject(id: string): Promise<Project | null> {
  const c = getAdminClient();
  if (!c) return null;
  const { data, error } = await c
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) console.error("[admin-data] adminGetProject:", error.message);
  return data ? mapProject(data) : null;
}

/** Đếm số dự án, dùng cho sort_order mặc định — không cần kéo cả bảng về. */
export async function adminCountProjects(): Promise<number> {
  const c = getAdminClient();
  if (!c) return 0;
  const { count, error } = await c
    .from("projects")
    .select("id", { count: "exact", head: true });
  if (error) console.error("[admin-data] adminCountProjects:", error.message);
  return count ?? 0;
}

export async function adminGetGallery(): Promise<GalleryImage[]> {
  const c = getAdminClient();
  if (!c) return [];
  const { data, error } = await c.from("gallery_images").select("*").order("sort_order");
  if (error) console.error("[admin-data] adminGetGallery:", error.message);
  return (data ?? []).map(mapGallery);
}
