"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/lib/types";

export function SkillBars({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {skills.map((s, i) => (
        <div key={s.id}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium">{s.title}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">
              {s.level}
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: `${s.percent}%` }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
