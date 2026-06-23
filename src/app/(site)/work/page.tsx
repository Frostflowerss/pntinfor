import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work",
  description: "Selected architecture & BIM projects.",
};

export default async function WorkPage() {
  const { projects } = await getSiteData();

  return (
    <div className="shell pb-10">
      <Reveal>
        <header className="mb-14 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            Projects — {String(projects.length).padStart(2, "0")}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-tight">
            <span className="vi">Dự án</span> <span className="en">Selected work</span>
          </h1>
          <p className="mt-5 text-balance text-fg-muted">
            Tuyển chọn các dự án kiến trúc và điều phối BIM — từ nghỉ dưỡng, giáo dục đến hạ tầng quy mô lớn.
          </p>
        </header>
      </Reveal>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <StaggerItem key={p.id}>
              <ProjectCard project={p} index={i} priority={i < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--line)] py-24 text-center">
      <p className="vi text-lg">Chưa có dự án nào.</p>
      <p className="en text-sm">No projects yet — add them in the studio.</p>
    </div>
  );
}
