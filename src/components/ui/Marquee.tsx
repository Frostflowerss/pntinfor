"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={cn("group relative flex items-center overflow-hidden", className)}>
      <div
        className={cn(
          "flex shrink-0 animate-marquee items-center motion-reduce:animate-none",
          // Hover chỉ phục vụ chuột. WCAG 2.2.2 yêu cầu mọi nội dung tự động
          // chuyển động quá 5s phải có cách dừng — nút bên dưới là cách đó.
          "group-hover:[animation-play-state:paused]",
          paused && "[animation-play-state:paused]"
        )}
      >
        {/* Danh sách được nhân đôi để vòng lặp liền mạch. Bản sao thứ hai
            aria-hidden, nếu không screen reader đọc mọi tên dự án hai lần. */}
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center" aria-hidden={copy === 1 || undefined}>
            {items.map((it, i) => (
              <span key={i} className="flex items-center">
                <span className="px-8 font-display text-2xl tracking-tight text-fg-muted sm:text-4xl">
                  {it}
                </span>
                <span className="text-accent">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Tiếp tục chạy chữ" : "Dừng chữ chạy"}
        className="no-print absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)]/80 text-fg-muted backdrop-blur transition-colors hover:text-fg"
      >
        {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
      </button>
    </div>
  );
}
