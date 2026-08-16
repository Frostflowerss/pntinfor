export type Lang = "vi" | "en";
export type CvMode = "compact" | "detail";
export type WorkStatus = "open" | "busy";

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
  /* ---- CV sheet settings (studio → Hồ sơ → Trang CV) ---- */
  status: WorkStatus;
  defaultLang: Lang;
  /** Sheet id shown in the topbar / title block, e.g. "CV-01" */
  sheetId: string;
  /** Revision label, e.g. "REV 2026.08". Empty = derived from updatedAt. */
  revision: string;
  /** Vertical spine line 1 (accent): "ARCHITECT · BIM COORDINATOR · BIM MANAGER" */
  spineRoles: string;
  /** Vertical spine line 2 (muted): "BIM MODELING · BIM CONSULTANT · BIM SOLUTION" */
  spineServices: string;
  updatedAt: string;
};

export type Experience = {
  id: string;
  company: string;
  timeframe: string;
  roleVI: string;
  roleEN: string;
  achievementsVI: string[];
  achievementsEN: string[];
  /** Timeline plotting. null endYear = present. 0 startYear = derive from timeframe. */
  startYear: number;
  endYear: number | null;
  sortOrder: number;
};

export type EducationKind = "degree" | "course";

export type Education = {
  id: string;
  name: string;
  descriptionVI: string;
  descriptionEN: string;
  /** Timeline plotting. 0 = derive from description text. */
  startYear: number;
  endYear: number | null;
  kind: EducationKind;
  /** Short label used on the sheet, e.g. "Cử nhân Kiến trúc" / "BIM Coordinator" */
  shortVI: string;
  shortEN: string;
  /** Issuing institution shown under the label. Empty = derived from name. */
  issuer: string;
  sortOrder: number;
};

export type SkillLevel = "Expert" | "Experienced" | "Skillful" | "Beginner";

export type Skill = {
  id: string;
  title: string;
  /** Short name for dense layouts, e.g. "Revit". Empty = derived. */
  shortTitle: string;
  level: SkillLevel;
  percent: number;
  sortOrder: number;
};

export type ProjectImage = {
  id: string;
  url: string;
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
  sortOrder: number;
};

export type SiteData = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  gallery: GalleryImage[];
};
