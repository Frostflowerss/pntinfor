import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";
import { getPublicClient, isSupabaseConfigured } from "./supabase";
import { fallbackData } from "./fallback";
import {
  mapProfile,
  mapExperience,
  mapEducation,
  mapSkill,
  mapProject,
  mapGallery,
  mapShowcase,
} from "./mappers";
import type { SiteData, Project } from "./types";

/** Tag để hủy cache khi admin lưu thay đổi (xem revalidateSite trong actions.ts). */
export const SITE_DATA_TAG = "site-data";

async function fetchSiteData(): Promise<SiteData> {
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

    // Chỉ dùng nội dung dự phòng khi TRUY VẤN LỖI (data == null), không dùng
    // khi bảng rỗng. Bản cũ kiểm tra `.length` nên nếu admin xóa hết dòng của
    // một mục thì site công khai lại âm thầm hiện lại nội dung hardcode, trong
    // khi panel hiện trống — nội dung ma không cách nào gỡ được.
    const data: SiteData = {
      profile: profile.data ? mapProfile(profile.data) : fallbackData.profile,
      experiences: experiences.data ? experiences.data.map(mapExperience) : fallbackData.experiences,
      education: education.data ? education.data.map(mapEducation) : fallbackData.education,
      skills: skills.data ? skills.data.map(mapSkill) : fallbackData.skills,
      projects: projects.data ? projects.data.map(mapProject) : fallbackData.projects,
      gallery: gallery.data?.map(mapGallery) ?? [],
      homeShowcase: showcase.data?.map(mapShowcase) ?? [],
    };
    return data;
  } catch (err) {
    // Bản cũ nuốt lỗi im lặng: Supabase sập hoặc đổi schema là site âm thầm
    // tụt về nội dung hardcode mà không có tín hiệu nào.
    console.error("[data] getSiteData thất bại, dùng nội dung dự phòng:", err);
    return fallbackData;
  }
}

/**
 * Cache liên-request, hủy theo tag.
 *
 * Bản cũ dùng một object ở module scope với TTL 30s. Trên serverless mỗi
 * instance giữ bản sao riêng, nên clearSiteCache() chỉ xóa được đúng lambda vừa
 * xử lý mutation — các instance khác vẫn trả nội dung cũ. Cộng với
 * `revalidate = 60` ở mỗi page thành hai tầng cache lệch nhau, sửa nội dung
 * trong panel có thể mất tới 90s mới lên và mỗi người xem thấy một bản khác.
 *
 * unstable_cache dùng chung một data cache cho mọi instance, và revalidateTag
 * hủy đồng loạt ngay khi lưu.
 */
const cachedSiteData = unstable_cache(fetchSiteData, ["site-data"], {
  tags: [SITE_DATA_TAG],
  revalidate: 60,
});

/** reactCache gộp nhiều lần gọi trong cùng một lượt render thành một. */
export const getSiteData = reactCache(async (): Promise<SiteData> => {
  if (!isSupabaseConfigured) return fallbackData;
  return cachedSiteData();
});

export async function getProject(slug: string): Promise<Project | null> {
  const data = await getSiteData();
  return data.projects.find((p) => p.slug === slug) ?? null;
}
