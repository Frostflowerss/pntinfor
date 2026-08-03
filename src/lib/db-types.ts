/**
 * Kiểu dữ liệu các bảng Postgres, viết theo đúng supabase/schema.sql.
 *
 * Trước đây toàn bộ tầng data dùng `any` (18 chỗ, hai file phải mở đầu bằng
 * eslint-disable), nghĩa là gõ sai tên cột snake_case sẽ không ai phát hiện cho
 * tới khi trang hiển thị trống trên production. Có kiểu ở đây thì `createClient
 * <Database>` bắt lỗi ngay lúc biên dịch.
 *
 * Muốn sinh tự động thay vì viết tay:
 *   npx supabase gen types typescript --project-id <id> > src/lib/db-types.ts
 * Khi đổi schema, nhớ cập nhật file này cho khớp.
 */

type Timestamptz = string;

export type ProfileRow = {
  id: number;
  name: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  address_vi: string | null;
  address_en: string | null;
  location_label: string | null;
  languages: string[] | null;
  avatar_url: string | null;
  cv_url: string | null;
  summary_vi: string | null;
  summary_en: string | null;
  home_headline_vi: string | null;
  home_headline_en: string | null;
  home_subline_vi: string | null;
  home_subline_en: string | null;
  accent: string | null;
  en_color: string | null;
  card_aspect: string | null;
  avatar_aspect: string | null;
  updated_at: Timestamptz | null;
};

export type ExperienceRow = {
  id: string;
  company: string | null;
  timeframe: string | null;
  role_vi: string | null;
  role_en: string | null;
  achievements_vi: string[] | null;
  achievements_en: string[] | null;
  sort_order: number | null;
};

export type EducationRow = {
  id: string;
  name: string | null;
  description_vi: string | null;
  description_en: string | null;
  sort_order: number | null;
};

export type SkillRow = {
  id: string;
  title: string | null;
  level: string | null;
  percent: number | null;
  sort_order: number | null;
};

export type ProjectImageRow = {
  id: string;
  project_id: string;
  url: string;
  width: number | null;
  height: number | null;
  sort_order: number | null;
};

export type ProjectRow = {
  id: string;
  slug: string | null;
  title_vi: string | null;
  title_en: string | null;
  construction_class_vi: string | null;
  construction_class_en: string | null;
  location_vi: string | null;
  location_en: string | null;
  primary_role_vi: string | null;
  primary_role_en: string | null;
  overview_vi: string | null;
  overview_en: string | null;
  responsibilities_vi: string[] | null;
  responsibilities_en: string[] | null;
  cover_url: string | null;
  featured: boolean | null;
  featured_order: number | null;
  aspect: string | null;
  sort_order: number | null;
};

/** Dạng trả về của truy vấn `projects` có join `project_images(*)`. */
export type ProjectWithImagesRow = ProjectRow & {
  project_images: ProjectImageRow[] | null;
};

export type GalleryImageRow = {
  id: string;
  url: string | null;
  alt: string | null;
  orientation: string | null;
  width: number | null;
  height: number | null;
  sort_order: number | null;
  created_at: Timestamptz | null;
};

export type HomeShowcaseRow = {
  id: string;
  url: string | null;
  sort_order: number | null;
};
