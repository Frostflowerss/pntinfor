"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

/** Subtle cursor-follow glow for hero (pointer-fine only, rAF-throttled). */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();
  const fine = usePointerFine();

  if (reduce || !fine) return <div className={className} aria-hidden />;

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty("--mx", `${x}px`);
      ref.current?.style.setProperty("--my", `${y}px`);
    });
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

/**
 * Proximity halo: a soft glow (EN font color) that follows the cursor.
 * The closer the cursor is to the element, the brighter; farther = dimmer.
 * Disabled on touch / reduced-motion. Works through the translucent card.
 */
export function ProximityGlow({
  children,
  className,
  radius = 340,
  color = "var(--en)",
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  color?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();
  const fine = usePointerFine();

  useEffect(() => {
    if (reduce || !fine) return;
    function onMove(e: MouseEvent) {
      const el = wrap.current;
      const g = glow.current;
      if (!el || !g) return;
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      // distance from cursor to nearest edge of the card (0 when inside)
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const dist = Math.hypot(dx, dy);
      const intensity = Math.pow(Math.max(0, 1 - dist / radius), 1.6);
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        g.style.setProperty("--gx", `${mx}px`);
        g.style.setProperty("--gy", `${my}px`);
        g.style.opacity = String(intensity);
      });
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, fine, radius]);

  return (
    <div ref={wrap} className={`relative ${className ?? ""}`}>
      {!reduce && fine && (
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[28px] opacity-0 blur-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at var(--gx,50%) var(--gy,50%), ${color}, transparent 65%)`,
          }}
        />
      )}
      {children}
    </div>
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
