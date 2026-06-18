"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Tilt } from "@/components/ui/Interactive";
import { SmartImage } from "@/components/ui/SmartImage";
import { classShort } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  priority,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  return (
    <Tilt max={6} className="h-full">
      <Link
        href={`/work/${project.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <SmartImage
            src={project.coverUrl}
            alt={project.titleEN}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
            wrapperClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />

          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur">
            Class {classShort(project.constructionClassEN)}
          </span>
          <span className="absolute right-4 top-4 font-mono text-xs text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>

          <motion.div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="vi font-display text-xl leading-tight text-white">{project.titleVI}</h3>
          <p className="en mt-1 text-sm">{project.titleEN}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/55">
            {project.locationEN}
          </p>
        </div>
      </Link>
    </Tilt>
  );
}
