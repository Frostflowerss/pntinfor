"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** Subtle cursor-follow glow. Pointer-fine devices only. */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={className}
      style={{
        background:
          "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), var(--accent-soft), transparent 70%)",
      }}
      aria-hidden
    />
  );
}

export function Bilingual({
  vi,
  en,
  className,
  enClassName,
}: {
  vi: string;
  en?: string;
  className?: string;
  enClassName?: string;
}) {
  return (
    <span className={className}>
      <span className="vi block">{vi}</span>
      {en ? <span className={`en block ${enClassName ?? ""}`}>{en}</span> : null}
    </span>
  );
}

export function nodesFrom(children: ReactNode) {
  return children;
}
