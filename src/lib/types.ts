export type Bilingual = { vi: string; en: string };

export type Profile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  addressVI: string;
  addressEN: string;
  locationLabel: string;
  languages: string[];
  avatarUrl: string;
  cvUrl: string;
  summaryVI: string;
  summaryEN: string;
  homeHeadlineVI: string;
  homeHeadlineEN: string;
  homeSublineVI: string;
  homeSublineEN: string;
  accent: string;
  enColor: string;
  cardAspect: string;
  avatarAspect: string;
};

export type Experience = {
  id: string;
  company: string;
  timeframe: string;
  roleVI: string;
  roleEN: string;
  achievementsVI: string[];
  achievementsEN: string[];
  sortOrder: number;
};

export type Education = {
  id: string;
  name: string;
  descriptionVI: string;
  descriptionEN: string;
  sortOrder: number;
};

/**
 * Nguồn DUY NHẤT cho danh sách mức kĩ năng.
 *
 * Trước đây danh sách này bị chép lại ở nhiều nơi (form admin, lớp validate),
 * và đã lệch nhau: bản validate ghi "Intermediate" thay vì "Experienced", nên
 * admin chọn "Experienced" là bị lặng lẽ đổi thành "Skillful" lúc lưu. Mọi nơi
 * cần danh sách này phải import từ đây để không lệch lại lần nữa.
 */
export const SKILL_LEVELS = ["Expert", "Experienced", "Skillful", "Beginner"] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number];

export type Skill = {
  id: string;
  title: string;
  level: SkillLevel;
  percent: number;
  sortOrder: number;
};

export type ProjectImage = {
  id: string;
  url: string;
  /** Kích thước gốc, null với ảnh tải lên trước khi có migration_image_dimensions. */
  width: number | null;
  height: number | null;
  sortOrder: number;
};

export type Project = {
  id: string;
  slug: string;
  titleVI: string;
  titleEN: string;
  constructionClassVI: string;
  constructionClassEN: string;
  locationVI: string;
  locationEN: string;
  primaryRoleVI: string;
  primaryRoleEN: string;
  overviewVI: string;
  overviewEN: string;
  responsibilitiesVI: string[];
  responsibilitiesEN: string[];
  coverUrl: string;
  images: ProjectImage[];
  featured: boolean;
  featuredOrder: number;
  aspect: string;
  sortOrder: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  width: number | null;
  height: number | null;
  sortOrder: number;
};

export type HomeShowcaseImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type SiteData = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  gallery: GalleryImage[];
  homeShowcase: HomeShowcaseImage[];
};
