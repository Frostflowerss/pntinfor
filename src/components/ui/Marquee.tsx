"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {doubled.map((it, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-display text-2xl tracking-tight text-fg-muted sm:text-4xl">
              {it}
            </span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
