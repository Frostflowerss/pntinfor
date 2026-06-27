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

export type SkillLevel = "Expert" | "Experienced" | "Skillful" | "Beginner";

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
