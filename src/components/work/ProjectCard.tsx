"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { classShort } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  priority,
  aspect = "16/11",
}: {
  project: Project;
  index: number;
  priority?: boolean;
  aspect?: string;
}) {
  // Bỏ hiệu ứng nghiêng theo chuột: mỗi card từng là một client component gắn
  // listener chuột riêng, 10 dự án là 10 listener chỉ để nghiêng 5 độ. Hiệu ứng
  // phóng ảnh + hiện mũi tên khi hover đã đủ phản hồi, và làm hoàn toàn bằng CSS.
  return (
    <div className="h-full">
      <Link
        href={`/work/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_50%,var(--line))]"
      >
        {/* Image (clean, not covered by text) */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: aspect.replace("/", " / ") }}
        >
          <SmartImage
            src={project.coverUrl}
            alt={project.titleEN}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            wrapperClassName="absolute inset-0"
          />
          {/* faint top scrim only for badge legibility */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/90 backdrop-blur">
            Class {classShort(project.constructionClassEN)}
          </span>
          <span className="absolute right-3 top-3 font-mono text-[11px] text-white/70">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-1.5 place-items-center rounded-full bg-accent text-white opacity-0 shadow-lg transition-all duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </div>

        {/* Caption below image */}
        <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
          <h3 className="vi font-display text-lg leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-xl">
            {project.titleVI}
          </h3>
          <p lang="en" className="en text-sm leading-snug">{project.titleEN}</p>
          <p className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-widest text-fg-faint">
            {project.locationEN}
          </p>
        </div>
      </Link>
    </div>
  );
}
