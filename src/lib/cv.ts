/**
 * CV Schedule Sheet — derivations.
 * Pure functions: SiteData → the values the sheet renders.
 * Kept free of React so it can be unit-tested and reused (print, OG image, …).
 */
import type {
  Education,
  Experience,
  Lang,
  Profile,
  Project,
  Skill,
  SkillLevel,
} from "./types";
import { classShort } from "./utils";

export const pick = (lang: Lang, vi: string, en: string) => (lang === "vi" ? vi : en);

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */
export const LABELS = {
  vi: {
    sum: "TÓM TẮT CHUYÊN MÔN",
    exp: "LỊCH SỬ CÔNG VIỆC",
    edu: "HỌC VẤN & KHÓA HỌC",
    skl: "KĨ NĂNG PHẦN MỀM",
    prj: "DỰ ÁN",
    con: "LIÊN HỆ",
    pName: "TÊN DỰ ÁN",
    pLoc: "ĐỊA ĐIỂM",
    pClass: "CẤP CT",
    mixTitle: "PHÂN BỐ DANH MỤC",
    clsTitle: "CẤP CÔNG TRÌNH",
    roleTitle: "VAI TRÒ ĐẢM NHẬN",
    zoomAll: "2016 → 2026",
    zoomRecent: "5 NĂM GẦN ĐÂY",
    present: "NAY",
    degree: "BẰNG",
    courses: "KHÓA HỌC",
    projects: "DỰ ÁN",
    provinces: "TỈNH THÀNH",
    items: "MỤC",
    page: "TRANG",
    more: "khóa cùng năm",
    special: "Đặc biệt",
    specialShort: "ĐB",
    classPrefix: "CẤP",
    cv: "CV / PDF",
    print: "PRINT",
    lv: ["Cơ bản", "Thành thạo", "Nâng cao", "Chuyên gia"],
    compactHint: "Bản Compact xem tốt nhất trên màn hình rộng.",
    contact: { email: "EMAIL", phone: "PHONE", address: "ADDRESS" },
    stats: ["DỰ ÁN", "PHẦN MỀM", "NƠI ĐÃ LÀM VIỆC", "HỌC VẤN & KHÓA HỌC"],
  },
  en: {
    sum: "SUMMARY",
    exp: "EXPERIENCE",
    edu: "EDUCATION",
    skl: "SOFTWARE SKILLS",
    prj: "PROJECTS",
    con: "CONTACT",
    pName: "PROJECT",
    pLoc: "LOCATION",
    pClass: "CLASS",
    mixTitle: "PORTFOLIO BREAKDOWN",
    clsTitle: "PROJECT CLASS",
    roleTitle: "ROLE COVERAGE",
    zoomAll: "2016 → 2026",
    zoomRecent: "LAST 5 YEARS",
    present: "PRESENT",
    degree: "DEGREE",
    courses: "COURSES",
    projects: "PROJECTS",
    provinces: "PROVINCES",
    items: "ITEMS",
    page: "PAGE",
    more: "more this year",
    special: "Special",
    specialShort: "SP",
    classPrefix: "CLASS",
    cv: "CV / PDF",
    print: "PRINT",
    lv: ["Basic", "Skilled", "Advanced", "Expert"],
    compactHint: "The Compact sheet is best viewed on a wide screen.",
    contact: { email: "EMAIL", phone: "PHONE", address: "ADDRESS" },
    stats: ["PROJECTS", "SOFTWARE TOOLS", "WORKPLACES", "QUALIFICATIONS"],
  },
} as const;

export type Labels = (typeof LABELS)[Lang];

/* ------------------------------------------------------------------ */
/* Years                                                               */
/* ------------------------------------------------------------------ */
export function nowYearFraction(d = new Date()): number {
  return d.getFullYear() + (d.getMonth() + 0.5) / 12;
}

const YEAR_RANGE = /(\d{4})\s*(?:[–—-]|to)\s*(\d{4}|present|nay|now)?/i;
const YEAR_ONE = /(\d{4})/;

/** "2022 – Present (Ha Noi)" → { start: 2022, end: null } */
export function parseYears(text: string): { start: number; end: number | null } | null {
  const m = text.match(YEAR_RANGE);
  if (m) {
    const start = +m[1];
    const e = m[2];
    const end = !e || /present|nay|now/i.test(e) ? null : +e;
    return { start, end };
  }
  const one = text.match(YEAR_ONE);
  if (one) return { start: +one[1], end: +one[1] };
  return null;
}

export function experienceYears(e: Experience): { start: number; end: number | null } {
  if (e.startYear) return { start: e.startYear, end: e.endYear };
  return parseYears(e.timeframe) ?? { start: new Date().getFullYear(), end: null };
}

export function educationYears(ed: Education): { start: number; end: number | null } {
  if (ed.startYear) return { start: ed.startYear, end: ed.endYear };
  const p = parseYears(ed.descriptionEN || ed.descriptionVI || ed.name);
  return p ?? { start: new Date().getFullYear(), end: null };
}

/** Degree ↔ course. Explicit `kind` wins; otherwise a year-range means degree. */
export function educationKind(ed: Education): "degree" | "course" {
  if (ed.kind === "degree") return "degree";
  if (ed.startYear && ed.endYear && ed.endYear > ed.startYear) return "degree";
  const y = parseYears(ed.descriptionEN || ed.descriptionVI);
  return y && y.end && y.end > y.start && !ed.startYear ? "degree" : "course";
}

/** "Vecas – Autodesk (BIM Coordinator Course)" → "Vecas – Autodesk" */
export function educationIssuer(ed: Education): string {
  if (ed.issuer) return ed.issuer;
  return ed.name.replace(/\s*\(.*\)\s*$/, "").trim() || ed.name;
}

/** Short label: explicit field, else the tail of the description after the last dash. */
export function educationShort(ed: Education, lang: Lang): string {
  const explicit = pick(lang, ed.shortVI, ed.shortEN);
  if (explicit) return explicit;
  const desc = pick(lang, ed.descriptionVI, ed.descriptionEN) || ed.name;
  const parts = desc.split(/\s[–—-]\s/);
  const tail = parts[parts.length - 1]?.trim();
  return (tail && tail.length < 60 ? tail : desc).replace(/^(Chứng nhận( hoàn thành)?|Certificate of Completion for|Certificate)\s+/i, "");
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */
export const LEVEL_CODE: Record<SkillLevel, string> = {
  Expert: "EXP",
  Experienced: "ADV",
  Skillful: "SKI",
  Beginner: "BAS",
};
export const LEVEL_ORDER: SkillLevel[] = ["Beginner", "Skillful", "Experienced", "Expert"];
export const LEVEL_PERCENT: Record<SkillLevel, number> = {
  Expert: 100,
  Experienced: 78,
  Skillful: 58,
  Beginner: 32,
};

/** "Autodesk Revit" → "Revit"; explicit shortTitle wins. */
export function skillShort(s: Skill): string {
  if (s.shortTitle) return s.shortTitle;
  return s.title.replace(/^(Autodesk|Adobe|Microsoft|Trimble|Graphisoft|Bentley|Google)\s+/i, "").trim() || s.title;
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
export type ProjectRow = {
  id: string;
  slug: string;
  n: string;
  title: string;
  cls: string; // "II" | "Đặc biệt" | "Special" …
  isTop: boolean;
  chip: string; // "II" | "ĐB" | "SP"
  loc: string;
  role: string;
  overview: string;
  clsFull: string;
};

const CLASS_ORDER_VI = ["Đặc biệt", "I", "II", "III", "IV"];
const CLASS_ORDER_EN = ["Special", "I", "II", "III", "IV"];

/** "Phú Yên, Việt Nam" → "Phú Yên" */
export function province(loc: string): string {
  return loc.split(",")[0]?.trim() || loc;
}

export function projectRows(projects: Project[], lang: Lang): ProjectRow[] {
  const L = LABELS[lang];
  return projects.map((p, i) => {
    const cls = classShort(pick(lang, p.constructionClassVI, p.constructionClassEN)) || "";
    const isTop = /đặc biệt|special/i.test(cls);
    return {
      id: p.id,
      slug: p.slug,
      n: String(i + 1).padStart(2, "0"),
      title: pick(lang, p.titleVI, p.titleEN) || pick(lang, p.titleEN, p.titleVI),
      cls,
      isTop,
      chip: isTop ? L.specialShort : cls,
      loc: province(pick(lang, p.locationVI, p.locationEN)),
      role: pick(lang, p.primaryRoleVI, p.primaryRoleEN),
      overview: pick(lang, p.overviewVI, p.overviewEN),
      clsFull: `${L.classPrefix} ${cls}`,
    };
  });
}

export type MixCell = { key: string; label: string; n: number; tone: number; pct: number };

/** Class distribution — 4 cells max, ordered Special → I → II → III. */
export function classMix(rows: ProjectRow[], lang: Lang): MixCell[] {
  const order = lang === "vi" ? CLASS_ORDER_VI : CLASS_ORDER_EN;
  const L = LABELS[lang];
  const counts = new Map<string, number>();
  rows.forEach((r) => counts.set(r.cls, (counts.get(r.cls) ?? 0) + 1));
  const keys = [...counts.keys()].sort((a, b) => {
    const ia = order.findIndex((o) => o.toLowerCase() === a.toLowerCase());
    const ib = order.findIndex((o) => o.toLowerCase() === b.toLowerCase());
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return keys.slice(0, 4).map((k, i) => {
    const isTop = /đặc biệt|special/i.test(k);
    return {
      key: k,
      label: isTop ? L.special.toUpperCase() : `${L.classPrefix} ${k}`,
      n: counts.get(k) ?? 0,
      tone: i,
      pct: rows.length ? ((counts.get(k) ?? 0) / rows.length) * 100 : 0,
    };
  });
}

export type RoleBar = { key: string; n: number; total: number; pct: number };

/** Role coverage — top 3 role tokens found across primaryRole strings. */
export function roleCoverage(rows: ProjectRow[]): RoleBar[] {
  const counts = new Map<string, number>();
  rows.forEach((r) => {
    const seen = new Set<string>();
    r.role
      .split(/\s*[–—|,/]\s*|\s+-\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => seen.add(t));
    seen.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, n]) => ({ key, n, total: rows.length, pct: rows.length ? (n / rows.length) * 100 : 0 }));
}

export function uniqueProvinces(rows: ProjectRow[]): string[] {
  return rows.map((r) => r.loc).filter((l, i, a) => l && a.indexOf(l) === i);
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */
export type Zoom = "all" | "recent";

export type TimelineJob = {
  id: string;
  company: string;
  role: string;
  left: number; // %
  width: number; // %
  tone: number; // 0..1 by recency
  current: boolean;
  label: string;
  labelLeft: number; // %
  delay: number; // ms
};

export type TimelineDegree = {
  id: string;
  left: number;
  width: number;
  short: string;
  issuer: string;
};

export type TimelineCourseGroup = {
  id: string;
  year: number;
  left: number;
  maxW: number; // % to next group
  name: string;
  issuer: string;
  more: number;
  delay: number;
};

export type Tick = { year: number; left: number; major: boolean; label: string };

export type Timeline = {
  a: number;
  b: number;
  jobs: TimelineJob[];
  degrees: TimelineDegree[];
  courses: TimelineCourseGroup[];
  drops: { left: number; delay: number; strong: boolean }[];
  ticks: Tick[];
  eduMeta: string;
  spanLabel: string; // "2016 — 2026"
};

export function buildTimeline(
  experiences: Experience[],
  education: Education[],
  lang: Lang,
  zoom: Zoom,
  now = nowYearFraction()
): Timeline {
  const L = LABELS[lang];
  const jobsRaw = experiences.map((e) => ({ e, ...experienceYears(e) }));
  const eduRaw = education.map((ed) => ({ ed, ...educationYears(ed), kind: educationKind(ed) }));

  const earliest = Math.min(
    ...jobsRaw.map((j) => j.start),
    ...eduRaw.map((d) => d.start),
    Math.floor(now)
  );
  const start = zoom === "all" ? earliest : Math.floor(now) - 5;
  const a = start;
  const b = now + 0.15;
  const span = b - a;
  const pos = (y: number) => Math.max(0, Math.min(100, ((y - a) / span) * 100));

  // Jobs, oldest first, filtered to the visible window
  const jobs = jobsRaw
    .sort((x, y) => x.start - y.start)
    .filter((j) => (j.end ?? now) > a + 0.05)
    .map((j, i, all) => {
      const s = j.start;
      const e = j.end ?? now;
      const l = pos(s);
      const w = Math.max(pos(e) - l, 0.8);
      const current = j.end === null;
      const tone = all.length > 1 ? i / (all.length - 1) : 1;
      return {
        id: j.e.id,
        company: j.e.company,
        role: pick(lang, j.e.roleVI, j.e.roleEN),
        left: l,
        width: w,
        tone,
        current,
        label: current ? `${s} — ${L.present}` : `${s} – ${e}`,
        labelLeft: current ? l + 1.2 : l + w + 1.2,
        delay: i * 130,
      };
    });

  const degrees: TimelineDegree[] = eduRaw
    .filter((d) => d.kind === "degree")
    .map((d) => ({
      id: d.ed.id,
      left: pos(d.start),
      width: Math.max(pos(d.end ?? d.start + 1) - pos(d.start), 0.8),
      short: educationShort(d.ed, lang),
      issuer: educationIssuer(d.ed),
    }));

  const groups = new Map<number, typeof eduRaw>();
  eduRaw
    .filter((d) => d.kind === "course")
    .forEach((d) => {
      const list = groups.get(d.start) ?? [];
      list.push(d);
      groups.set(d.start, list);
    });
  const years = [...groups.keys()].sort((x, y) => x - y);
  const courses: TimelineCourseGroup[] = years.map((y, i) => {
    const list = groups.get(y)!;
    const px = pos(y);
    const nx = i + 1 < years.length ? pos(years[i + 1]) : 100;
    return {
      id: `cg-${y}`,
      year: y,
      left: px,
      maxW: Math.max(nx - px, 10),
      name: educationShort(list[0].ed, lang),
      issuer: educationIssuer(list[0].ed),
      more: list.length - 1,
      delay: 520 + i * 140,
    };
  });

  const drops = [
    ...jobs.map((j) => ({ left: j.left, delay: j.delay, strong: false })),
    ...courses.map((c) => ({ left: c.left, delay: c.delay, strong: true })),
  ];

  const ticks: Tick[] = [];
  const first = Math.ceil(a);
  const last = Math.floor(b);
  const every = zoom === "all" ? 3 : 1;
  for (let y = first; y <= last; y++) {
    const major = (y - first) % every === 0 || y === last;
    ticks.push({ year: y, left: pos(y), major, label: major ? String(y) : String(y).slice(2) });
  }

  const nDeg = degrees.length;
  const nCourse = eduRaw.length - nDeg;
  return {
    a,
    b,
    jobs,
    degrees,
    courses,
    drops,
    ticks,
    eduMeta: `${nDeg} ${L.degree} · ${nCourse} ${L.courses}`,
    spanLabel: `${earliest} — ${Math.floor(now)}`,
  };
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */
export function revisionLabel(profile: Profile, now = new Date()): string {
  if (profile.revision) return profile.revision;
  const d = profile.updatedAt ? new Date(profile.updatedAt) : now;
  const safe = isNaN(d.getTime()) ? now : d;
  return `REV ${safe.getFullYear()}.${String(safe.getMonth() + 1).padStart(2, "0")}`;
}

export function spineLines(profile: Profile): { roles: string; services: string } {
  return {
    roles: profile.spineRoles || profile.role.toUpperCase(),
    services: profile.spineServices,
  };
}
