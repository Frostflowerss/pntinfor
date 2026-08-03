"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Skill } from "@/lib/types";

export function SkillBars({ skills }: { skills: Skill[] }) {
  // Đây là component duy nhất còn animate mà không kiểm tra reduced-motion.
  // Khối CSS @media chỉ ép transition-duration về 0, không chặn được animation
  // do JS của framer-motion điều khiển.
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {skills.map((s, i) => {
        const pct = Math.max(0, Math.min(100, s.percent));
        return (
          <div key={s.id}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium">{s.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                {s.level}
              </span>
            </div>
            <div
              // Thanh mức độ vốn là div trần, screen reader không đọc được gì
              // ngoài chữ level bên trên.
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${s.title}: ${s.level}`}
              className="h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
            >
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: "-15%" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
