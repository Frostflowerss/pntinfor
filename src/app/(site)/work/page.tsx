import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { ScrollParallax } from "@/components/ui/Parallax";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work",
  description: "Selected architecture & BIM projects.",
};

export default async function WorkPage() {
  const { projects, profile } = await getSiteData();

  return (
    <div className="shell pb-10">
      <Reveal>
        <header className="mb-14 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            Projects — {String(projects.length).padStart(2, "0")}
          </p>
          <ScrollParallax distance={26}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-tight">
              <span className="vi">Dự án</span> <span lang="en" className="en">Selected work</span>
            </h1>
          </ScrollParallax>
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
              {/* Trang này trước đây không truyền aspect nên card luôn 16/11,
                  bỏ qua profile.cardAspect — trong khi trang chủ lại tôn trọng
                  nó, làm hai trang hiện cùng dự án với tỉ lệ khác nhau.
                  priority chỉ cho card đầu: nhiều ảnh priority sẽ tranh băng
                  thông với chính ứng viên LCP. */}
              <ProjectCard
                project={p}
                index={i}
                priority={i === 0}
                aspect={p.aspect || profile.cardAspect}
              />
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
      <p lang="en" className="en text-sm">No projects yet.</p>
    </div>
  );
}
