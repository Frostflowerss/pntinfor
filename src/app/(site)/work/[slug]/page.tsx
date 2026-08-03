import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Layers, UserCog } from "lucide-react";
import { getSiteData, getProject } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { Reveal } from "@/components/ui/motion";
import { classShort } from "@/lib/utils";

export const revalidate = 60;
// Slug không nằm trong generateStaticParams sẽ trả 404 thật thay vì dựng động.
// Với ISR, notFound() trong route dựng động bị Next trả về HTTP 200 (soft 404)
// — Google coi đó là trang hợp lệ và index một trang "không tìm thấy".
export const dynamicParams = false;

export async function generateStaticParams() {
  const { projects } = await getSiteData();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.titleEN,
    description: project.overviewEN,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.titleEN,
      description: project.overviewEN,
      type: "article",
      url: `/work/${slug}`,
      images: project.coverUrl ? [project.coverUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.titleEN,
      description: project.overviewEN,
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSiteData();
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = data.projects.findIndex((p) => p.slug === slug);
  // Chỉ có 1 dự án thì phép chia dư trỏ ngược về chính trang đang xem.
  const next = data.projects.length > 1 ? data.projects[(idx + 1) % data.projects.length] : null;

  const meta = [
    { icon: Layers, vi: project.constructionClassVI, en: `Class ${classShort(project.constructionClassEN)}` },
    { icon: MapPin, vi: project.locationVI, en: project.locationEN },
    { icon: UserCog, vi: project.primaryRoleVI, en: project.primaryRoleEN },
  ];

  const galleryImages = [
    // Ảnh bìa chưa có cột kích thước riêng nên để null, component tự dùng tỉ lệ dự phòng.
    ...(project.coverUrl ? [{ url: project.coverUrl, width: null, height: null }] : []),
    ...project.images.map((i) => ({ url: i.url, width: i.width, height: i.height })),
  ];

  // CreativeWork + BreadcrumbList: giúp Google hiểu đây là một công trình cụ
  // thể của một người cụ thể, và hiện đường dẫn phân cấp trong kết quả tìm kiếm.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.titleEN,
        description: project.overviewEN || undefined,
        image: project.coverUrl || undefined,
        url: `${SITE_URL}/work/${project.slug}`,
        creator: { "@type": "Person", name: data.profile.name },
        locationCreated: project.locationEN
          ? { "@type": "Place", name: project.locationEN }
          : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name: project.titleEN },
        ],
      },
    ],
  };

  return (
    <article className="shell pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Link
        href="/work"
        className="group mb-10 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
        Tất cả dự án / All work
      </Link>

      <Reveal>
        <header className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            {String(idx + 1).padStart(2, "0")} / {String(data.projects.length).padStart(2, "0")}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-light leading-[0.98] tracking-tight">
            <span className="vi block">{project.titleVI}</span>
            <span lang="en" className="en mt-2 block text-[0.55em]">{project.titleEN}</span>
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] sm:grid-cols-3">
          {meta.map((m, i) => (
            <div key={i} className="bg-[var(--ink-soft)] p-5">
              <m.icon size={16} className="text-accent" />
              <p className="vi mt-3 text-sm font-medium">{m.vi}</p>
              <p lang="en" className="en text-xs">{m.en}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
              Overview
            </h2>
            <p className="vi mt-4 leading-relaxed">{project.overviewVI}</p>
            <p lang="en" className="en mt-3 text-sm leading-relaxed">{project.overviewEN}</p>

            {project.responsibilitiesVI.length > 0 && (
              <>
                <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
                  Key responsibilities
                </h2>
                <ul className="mt-4 space-y-4">
                  {project.responsibilitiesVI.map((r, i) => (
                    <li key={i} className="border-l border-accent/40 pl-4">
                      <span className="vi block text-sm leading-relaxed">{r}</span>
                      <span lang="en" className="en block text-xs leading-relaxed">
                        {project.responsibilitiesEN[i] ?? ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>

        <div>
          <ProjectGallery images={galleryImages} title={project.titleEN} />
        </div>
      </div>

      {next && (
      <Reveal>
        <Link
          href={`/work/${next.slug}`}
          className="group mt-24 flex items-center justify-between gap-6 border-t border-[var(--line)] pt-10"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
              Next project
            </p>
            <p className="vi mt-2 font-display text-2xl tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
              {next.titleVI}
            </p>
          </div>
          <ArrowRight
            size={28}
            className="shrink-0 text-fg-muted transition-transform group-hover:translate-x-2 group-hover:text-accent"
          />
        </Link>
      </Reveal>
      )}
    </article>
  );
}
