"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  createSession,
  destroySession,
  isAuthed,
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

/* ---------------- Auth ---------------- */
export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    return { error: "Sai ID hoặc mật khẩu." };
  }
  await createSession();
  redirect("/pntarch/projects");
}

export async function logoutAction() {
  await destroySession();
  redirect("/pntarch");
}

/* ---------------- Storage ---------------- */
export async function deleteStorageObject(url: string) {
  const client = await guard();
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await client.storage.from(STORAGE_BUCKET).remove([path]);
}

/* ---------------- Profile ---------------- */
export async function saveProfile(formData: FormData) {
  const client = await guard();
  const f = (k: string) => String(formData.get(k) ?? "");
  const languages = f("languages")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

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
    updated_at: new Date().toISOString(),
  };
  const { error } = await client.from("profile").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);
  revalidateSite();
}

/* ---------------- Experiences ---------------- */
export async function saveExperience(formData: FormData) {
  const client = await guard();
  const f = (k: string) => String(formData.get(k) ?? "");
  const id = f("id");
  const lines = (k: string) =>
    f(k)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const row = {
    company: f("company"),
    timeframe: f("timeframe"),
    role_vi: f("roleVI"),
    role_en: f("roleEN"),
    achievements_vi: lines("achievementsVI"),
    achievements_en: lines("achievementsEN"),
    sort_order: Number(f("sortOrder") || 0),
  };
  const q = id
    ? client.from("experiences").update(row).eq("id", id)
    : client.from("experiences").insert(row);
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
  const f = (k: string) => String(formData.get(k) ?? "");
  const id = f("id");
  const row = {
    name: f("name"),
    description_vi: f("descriptionVI"),
    description_en: f("descriptionEN"),
    sort_order: Number(f("sortOrder") || 0),
  };
  const q = id
    ? client.from("education").update(row).eq("id", id)
    : client.from("education").insert(row);
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
export async function saveSkill(formData: FormData) {
  const client = await guard();
  const f = (k: string) => String(formData.get(k) ?? "");
  const id = f("id");
  const row = {
    title: f("title"),
    level: f("level"),
    percent: Number(f("percent") || 50),
    sort_order: Number(f("sortOrder") || 0),
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
export async function saveProject(formData: FormData) {
  const client = await guard();
  const f = (k: string) => String(formData.get(k) ?? "");
  const id = f("id");
  const lines = (k: string) =>
    f(k)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

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
    responsibilities_vi: lines("responsibilitiesVI"),
    responsibilities_en: lines("responsibilitiesEN"),
    cover_url: f("coverUrl"),
    sort_order: Number(f("sortOrder") || 0),
  };

  let projectId = id;
  if (id) {
    const { error } = await client.from("projects").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await client.from("projects").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  // Detail images: JSON array of urls
  const imagesJson = f("imagesJson");
  if (imagesJson && projectId) {
    let urls: string[] = [];
    try {
      urls = JSON.parse(imagesJson);
    } catch {}
    await client.from("project_images").delete().eq("project_id", projectId);
    if (urls.length) {
      await client.from("project_images").insert(
        urls.map((url, i) => ({ project_id: projectId, url, sort_order: i }))
      );
    }
  }

  revalidateSite();
  redirect("/pntarch/projects");
}

export async function deleteProject(id: string) {
  const client = await guard();
  await client.from("project_images").delete().eq("project_id", id);
  await client.from("projects").delete().eq("id", id);
  revalidateSite();
}

export async function reorderProject(id: string, sortOrder: number) {
  const client = await guard();
  await client.from("projects").update({ sort_order: sortOrder }).eq("id", id);
  revalidateSite();
}

/* ---------------- Gallery ---------------- */
export async function addGalleryImages(items: { url: string; orientation: string }[]) {
  const client = await guard();
  const { data: existing } = await client
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  let next = (existing?.[0]?.sort_order ?? -1) + 1;
  const rows = items.map((it) => ({
    url: it.url,
    alt: "Gallery image",
    orientation: it.orientation === "vertical" ? "vertical" : "horizontal",
    sort_order: next++,
  }));
  const { error } = await client.from("gallery_images").insert(rows);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function updateGalleryImage(id: string, orientation: string) {
  const client = await guard();
  await client
    .from("gallery_images")
    .update({ orientation: orientation === "vertical" ? "vertical" : "horizontal" })
    .eq("id", id);
  revalidateSite();
}

export async function deleteGalleryImage(id: string) {
  const client = await guard();
  await client.from("gallery_images").delete().eq("id", id);
  revalidateSite();
}
