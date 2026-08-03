/**
 * Chuyển dòng dữ liệu Postgres (snake_case) sang kiểu dùng trong giao diện.
 *
 * data.ts (đọc công khai) và admin-data.ts (đọc trong panel) trước đây mỗi bên
 * giữ một bản sao gần như nguyên văn của những hàm này — khoảng 120 dòng trùng
 * lặp, và đã lệch nhau ở chi tiết nhỏ: bên public lọc phần tử rỗng khỏi mảng,
 * bên admin thì không. Gom về một chỗ để hai bên không thể lệch tiếp.
 */
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  GalleryImage,
  HomeShowcaseImage,
  SkillLevel,
} from "./types";
import { SKILL_LEVELS } from "./types";
import type {
  ProfileRow,
  ExperienceRow,
  EducationRow,
  SkillRow,
  ProjectWithImagesRow,
  GalleryImageRow,
  HomeShowcaseRow,
} from "./db-types";

const arr = (v: string[] | null | undefined): string[] =>
  Array.isArray(v) ? v.filter(Boolean) : [];

export function mapProfile(r: ProfileRow): Profile {
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
    avatarAspect: r.avatar_aspect || "4/5",
  };
}

export const mapExperience = (r: ExperienceRow): Experience => ({
  id: r.id,
  company: r.company ?? "",
  timeframe: r.timeframe ?? "",
  roleVI: r.role_vi ?? "",
  roleEN: r.role_en ?? "",
  achievementsVI: arr(r.achievements_vi),
  achievementsEN: arr(r.achievements_en),
  sortOrder: r.sort_order ?? 0,
});

export const mapEducation = (r: EducationRow): Education => ({
  id: r.id,
  name: r.name ?? "",
  descriptionVI: r.description_vi ?? "",
  descriptionEN: r.description_en ?? "",
  sortOrder: r.sort_order ?? 0,
});

export const mapSkill = (r: SkillRow): Skill => ({
  id: r.id,
  title: r.title ?? "",
  level: (SKILL_LEVELS as readonly string[]).includes(r.level ?? "") ? (r.level as SkillLevel) : "Skillful",
  percent: r.percent ?? 50,
  sortOrder: r.sort_order ?? 0,
});

export const mapProject = (r: ProjectWithImagesRow): Project => ({
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
    .map((i) => ({
      id: i.id,
      url: i.url,
      width: i.width ?? null,
      height: i.height ?? null,
      sortOrder: i.sort_order ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder),
  featured: r.featured ?? false,
  featuredOrder: r.featured_order ?? 0,
  aspect: r.aspect ?? "",
  sortOrder: r.sort_order ?? 0,
});

export const mapGallery = (r: GalleryImageRow): GalleryImage => ({
  id: r.id,
  url: r.url ?? "",
  alt: r.alt ?? "",
  orientation: r.orientation === "vertical" ? "vertical" : "horizontal",
  width: r.width ?? null,
  height: r.height ?? null,
  sortOrder: r.sort_order ?? 0,
});

export const mapShowcase = (r: HomeShowcaseRow): HomeShowcaseImage => ({
  id: r.id,
  url: r.url ?? "",
  sortOrder: r.sort_order ?? 0,
});
