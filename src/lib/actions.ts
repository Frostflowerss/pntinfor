"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearFailures,
  clientIp,
  createSession,
  destroySession,
  isAuthConfigured,
  isAuthed,
  isLocked,
  recordFailure,
} from "@/lib/auth";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase";
import { clearSiteCache } from "@/lib/data";
import { slugify } from "@/lib/utils";

type ActionState = { ok?: boolean; error?: string };

async function guard() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
  const client = getAdminClient();
  if (!client) throw new Error("Supabase service role key is not configured.");
  return client;
}

function revalidateSite() {
  clearSiteCache();
  revalidatePath("/", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (fd: FormData, k: string) =>
  str(fd, k)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const int = (fd: FormData, k: string, d = 0) => {
  const n = Number(str(fd, k));
  return Number.isFinite(n) ? Math.trunc(n) : d;
};
const yearOrNull = (fd: FormData, k: string) => {
  const n = Number(str(fd, k));
  return Number.isFinite(n) && n > 1900 ? Math.trunc(n) : null;
};

/* ---------------- Auth ---------------- */
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isAuthConfigured) {
    return {
      error:
        "Studio chưa được cấu hình: đặt ADMIN_USERNAME, ADMIN_PASSWORD và ADMIN_SESSION_SECRET (≥ 32 ký tự).",
    };
  }
  const ip = await clientIp();
  const lockedFor = isLocked(ip);
  if (lockedFor) {
    return { error: `Quá nhiều lần thử. Thử lại sau ${lockedFor} phút.` };
  }
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    recordFailure(ip);
    // Small constant delay to blunt online guessing.
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Sai ID hoặc mật khẩu." };
  }
  clearFailures(ip);
  await createSession();
  redirect("/pntarch/projects");
}

export async function logoutAction() {
  await destroySession();
  redirect("/pntarch");
}

/* ---------------- Storage helpers ---------------- */
const MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

function storagePath(url: string): string | null {
  const idx = url.indexOf(MARKER);
  return idx === -1 ? null : url.slice(idx + MARKER.length);
}

/** Best-effort delete of storage objects for URLs no longer referenced. Never throws. */
async function removeStorageUrls(client: NonNullable<ReturnType<typeof getAdminClient>>, urls: string[]) {
  const paths = urls.map(storagePath).filter((p): p is string => Boolean(p));
  if (!paths.length) return;
  try {
    await client.storage.from(STORAGE_BUCKET).remove(paths);
  } catch {
    /* ignore — orphaned files can be cleaned later */
  }
}

/* ---------------- Profile ---------------- */
export async function saveProfile(formData: FormData) {
  const client = await guard();
  const f = (k: string) => str(formData, k);
  const languages = f("languages")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { data: prev } = await client.from("profile").select("avatar_url, cv_url").eq("id", 1).maybeSingle();

  const row = {
    id: 1,
    name: f("name"),
    role: f("role"),
    email: f("email"),
    phone: f("phone"),
    address_vi: f("addressVI"),
    address_en: f("addressEN"),
    location_label: f("locationLabel"),
    languages,
    avatar_url: f("avatarUrl"),
    cv_url: f("cvUrl"),
    summary_vi: f("summaryVI"),
    summary_en: f("summaryEN"),
    home_headline_vi: f("homeHeadlineVI"),
    home_headline_en: f("homeHeadlineEN"),
    home_subline_vi: f("homeSublineVI"),
    home_subline_en: f("homeSublineEN"),
    accent: f("accent") || "#5c8cff",
    en_color: f("enColor"),
    card_aspect: f("cardAspect") || "16/11",
    status: f("status") === "busy" ? "busy" : "open",
    default_lang: f("defaultLang") === "en" ? "en" : "vi",
    sheet_id: f("sheetId") || "CV-01",
    revision: f("revision"),
    spine_roles: f("spineRoles"),
    spine_services: f("spineServices"),
    updated_at: new Date().toISOString(),
  };
  const { error } = await client.from("profile").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);

  // Garbage-collect replaced avatar / CV files.
  const orphans: string[] = [];
  if (prev?.avatar_url && prev.avatar_url !== row.avatar_url) orphans.push(prev.avatar_url);
  if (prev?.cv_url && prev.cv_url !== row.cv_url) orphans.push(prev.cv_url);
  await removeStorageUrls(client, orphans);

  revalidateSite();
}

/* ---------------- Experiences ---------------- */
export async function saveExperience(formData: FormData) {
  const client = await guard();
  const id = str(formData, "id");
  const row = {
    company: str(formData, "company"),
    timeframe: str(formData, "timeframe"),
    role_vi: str(formData, "roleVI"),
    role_en: str(formData, "roleEN"),
    achievements_vi: lines(formData, "achievementsVI"),
    achievements_en: lines(formData, "achievementsEN"),
    start_year: int(formData, "startYear", 0),
    end_year: yearOrNull(formData, "endYear"),
    sort_order: int(formData, "sortOrder"),
  };
  const q = id ? client.from("experiences").update(row).eq("id", id) : client.from("experiences").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/pntarch/experience");
}

export async function deleteExperience(id: string) {
  const client = await guard();
  await client.from("experiences").delete().eq("id", id);
  revalidateSite();
}

/* ---------------- Education ---------------- */
export async function saveEducation(formData: FormData) {
  const client = await guard();
  const id = str(formData, "id");
  const row = {
    name: str(formData, "name"),
    description_vi: str(formData, "descriptionVI"),
    description_en: str(formData, "descriptionEN"),
    start_year: int(formData, "startYear", 0),
    end_year: yearOrNull(formData, "endYear"),
    kind: str(formData, "kind") === "degree" ? "degree" : "course",
    short_vi: str(formData, "shortVI"),
    short_en: str(formData, "shortEN"),
    issuer: str(formData, "issuer"),
    sort_order: int(formData, "sortOrder"),
  };
  const q = id ? client.from("education").update(row).eq("id", id) : client.from("education").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/pntarch/education");
}

export async function deleteEducation(id: string) {
  const client = await guard();
  await client.from("education").delete().eq("id", id);
  revalidateSite();
}

/* ---------------- Skills ---------------- */
const LEVELS = new Set(["Expert", "Experienced", "Skillful", "Beginner"]);

export async function saveSkill(formData: FormData) {
  const client = await guard();
  const id = str(formData, "id");
  const level = str(formData, "level");
  const row = {
    title: str(formData, "title"),
    short_title: str(formData, "shortTitle"),
    level: LEVELS.has(level) ? level : "Skillful",
    percent: Math.max(0, Math.min(100, int(formData, "percent", 50))),
    sort_order: int(formData, "sortOrder"),
  };
  const q = id ? client.from("skills").update(row).eq("id", id) : client.from("skills").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/pntarch/skills");
}

export async function deleteSkill(id: string) {
  const client = await guard();
  await client.from("skills").delete().eq("id", id);
  revalidateSite();
}

/* ---------------- Projects ---------------- */
type PrevFiles = { cover_url: string | null; project_images: { url: string }[] | null } | null;
const filesOf = (p: PrevFiles): string[] =>
  [p?.cover_url ?? "", ...(p?.project_images ?? []).map((i) => i.url)].filter(Boolean);

export async function saveProject(formData: FormData) {
  const client = await guard();
  const f = (k: string) => str(formData, k);
  const id = f("id");

  const slug = f("slug") ? slugify(f("slug")) : slugify(f("titleEN") || f("titleVI") || "project");

  const row = {
    slug,
    title_vi: f("titleVI"),
    title_en: f("titleEN"),
    construction_class_vi: f("constructionClassVI"),
    construction_class_en: f("constructionClassEN"),
    location_vi: f("locationVI"),
    location_en: f("locationEN"),
    primary_role_vi: f("primaryRoleVI"),
    primary_role_en: f("primaryRoleEN"),
    overview_vi: f("overviewVI"),
    overview_en: f("overviewEN"),
    responsibilities_vi: lines(formData, "responsibilitiesVI"),
    responsibilities_en: lines(formData, "responsibilitiesEN"),
    cover_url: f("coverUrl"),
    featured: f("featured") === "on" || f("featured") === "true",
    featured_order: int(formData, "featuredOrder"),
    aspect: f("aspect"),
    sort_order: int(formData, "sortOrder"),
  };

  // Snapshot previous files so we can garbage-collect what was removed.
  let prevUrls: string[] = [];
  if (id) {
    const { data: prev } = await client
      .from("projects")
      .select("cover_url, project_images(url)")
      .eq("id", id)
      .maybeSingle();
    prevUrls = filesOf(prev as PrevFiles);
  }

  let projectId = id;
  if (id) {
    const { error } = await client.from("projects").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await client.from("projects").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  // Detail images: JSON array of urls, in display order.
  let urls: string[] = [];
  try {
    const parsed = JSON.parse(f("imagesJson") || "[]");
    if (Array.isArray(parsed)) urls = parsed.filter((u) => typeof u === "string");
  } catch {}
  if (projectId) {
    await client.from("project_images").delete().eq("project_id", projectId);
    if (urls.length) {
      const { error } = await client
        .from("project_images")
        .insert(urls.map((url, i) => ({ project_id: projectId, url, sort_order: i })));
      if (error) throw new Error(error.message);
    }
  }

  const keep = new Set([row.cover_url, ...urls]);
  await removeStorageUrls(client, prevUrls.filter((u) => !keep.has(u)));

  revalidateSite();
  redirect("/pntarch/projects");
}

export async function deleteProject(id: string) {
  const client = await guard();
  const { data: prev } = await client
    .from("projects")
    .select("cover_url, project_images(url)")
    .eq("id", id)
    .maybeSingle();
  await client.from("project_images").delete().eq("project_id", id);
  await client.from("projects").delete().eq("id", id);
  await removeStorageUrls(client, filesOf(prev as PrevFiles));
  revalidateSite();
}

export async function reorderProject(id: string, sortOrder: number) {
  const client = await guard();
  await client.from("projects").update({ sort_order: sortOrder }).eq("id", id);
  revalidateSite();
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const client = await guard();
  await client.from("projects").update({ featured }).eq("id", id);
  revalidateSite();
}

/* ---------------- Gallery ---------------- */
export async function addGalleryImages(items: { url: string; orientation: string; alt?: string }[]) {
  const client = await guard();
  const { data: existing } = await client
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  let next = (existing?.[0]?.sort_order ?? -1) + 1;
  const rows = items.map((it) => ({
    url: it.url,
    alt: (it.alt ?? "").slice(0, 200),
    orientation: it.orientation === "vertical" ? "vertical" : "horizontal",
    sort_order: next++,
  }));
  const { error } = await client.from("gallery_images").insert(rows);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function updateGalleryImage(
  id: string,
  patch: { orientation?: string; alt?: string; sortOrder?: number }
) {
  const client = await guard();
  const row: Record<string, unknown> = {};
  if (patch.orientation !== undefined)
    row.orientation = patch.orientation === "vertical" ? "vertical" : "horizontal";
  if (patch.alt !== undefined) row.alt = patch.alt.slice(0, 200);
  if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder;
  if (!Object.keys(row).length) return;
  await client.from("gallery_images").update(row).eq("id", id);
  revalidateSite();
}

export async function reorderGallery(ids: string[]) {
  const client = await guard();
  await Promise.all(ids.map((id, i) => client.from("gallery_images").update({ sort_order: i }).eq("id", id)));
  revalidateSite();
}

export async function deleteGalleryImage(id: string) {
  const client = await guard();
  const { data: prev } = await client.from("gallery_images").select("url").eq("id", id).maybeSingle();
  await client.from("gallery_images").delete().eq("id", id);
  if (prev?.url) await removeStorageUrls(client, [prev.url]);
  revalidateSite();
}
