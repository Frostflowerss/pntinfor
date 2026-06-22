import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Project } from "@/lib/types";

export function SelectedWork({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 4);

  return (
    <section className="shell py-24">
      <Reveal>
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
              01 — Selected work
            </p>
            <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-5xl">
              <span className="vi">Dự án tiêu biểu</span>
            </h2>
          </div>
          <Link
            href="/work"
            className="group hidden items-center gap-2 text-sm text-fg-muted hover:text-fg sm:inline-flex"
          >
            Tất cả dự án
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <Stagger className="grid gap-6 md:grid-cols-2">
        {featured.map((p, i) => (
          <StaggerItem key={p.id}>
            <ProjectCard project={p} index={i} priority={i < 2} />
          </StaggerItem>
        ))}
      </Stagger>

      <Link
        href="/work"
        className="mt-8 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg sm:hidden"
      >
        Tất cả dự án <ArrowRight size={15} />
      </Link>
    </section>
  );
}
