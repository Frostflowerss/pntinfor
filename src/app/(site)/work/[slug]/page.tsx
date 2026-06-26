import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Layers, UserCog } from "lucide-react";
import { getSiteData, getProject } from "@/lib/data";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { Reveal } from "@/components/ui/motion";
import { classShort } from "@/lib/utils";

export const revalidate = 60;

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
    openGraph: { images: project.coverUrl ? [project.coverUrl] : [] },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSiteData();
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = data.projects.findIndex((p) => p.slug === slug);
  const next = data.projects[(idx + 1) % data.projects.length];

  const meta = [
    { icon: Layers, vi: project.constructionClassVI, en: `Class ${classShort(project.constructionClassEN)}` },
    { icon: MapPin, vi: project.locationVI, en: project.locationEN },
    { icon: UserCog, vi: project.primaryRoleVI, en: project.primaryRoleEN },
  ];

  const galleryImages = [project.coverUrl, ...project.images.map((i) => i.url)].filter(Boolean);

  return (
    <article className="shell pb-10">
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
            <span className="en mt-2 block text-[0.55em]">{project.titleEN}</span>
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] sm:grid-cols-3">
          {meta.map((m, i) => (
            <div key={i} className="bg-[var(--ink-soft)] p-5">
              <m.icon size={16} className="text-accent" />
              <p className="vi mt-3 text-sm font-medium">{m.vi}</p>
              <p className="en text-xs">{m.en}</p>
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
            <p className="en mt-3 text-sm leading-relaxed">{project.overviewEN}</p>

            {project.responsibilitiesVI.length > 0 && (
              <>
                <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
                  Key responsibilities
                </h2>
                <ul className="mt-4 space-y-4">
                  {project.responsibilitiesVI.map((r, i) => (
                    <li key={i} className="border-l border-accent/40 pl-4">
                      <span className="vi block text-sm leading-relaxed">{r}</span>
                      <span className="en block text-xs leading-relaxed">
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
    </article>
  );
}
