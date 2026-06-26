"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

/**
 * Decorative architectural backdrop:
 *  - A1 "Blueprint drift": a fine grid that drifts very slowly with scroll.
 *  - A2 "Contour lines": a few flowing architectural lines.
 * Sits behind content — drop it inside a `relative isolate` parent.
 * Animation is gated to fine-pointer, motion-allowed devices (off on
 * touch / reduced-motion) and never appears in print.
 */
export function BackgroundFX({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "footer";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const animate = !reduce && fine;

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    const factor = variant === "hero" ? -0.05 : 0.045;

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const progress = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.setProperty("--drift", `${progress * factor}px`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [animate, variant]);

  const mask =
    variant === "hero"
      ? "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)"
      : "radial-gradient(ellipse 90% 80% at 50% 100%, #000 20%, transparent 80%)";

  return (
    <div
      ref={ref}
      data-fx
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden print:hidden ${className}`}
    >
      <div
        className="bp-layer absolute inset-0"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      />
      <svg
        className={`contour absolute inset-0 h-full w-full ${animate ? "contour--anim" : ""}`}
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-50 130 C 250 50, 450 230, 700 150 S 1150 70, 1300 190" />
        <path d="M-50 310 C 200 250, 520 390, 760 310 S 1150 250, 1300 350" />
        <path d="M-50 480 C 300 420, 540 550, 820 470 S 1150 430, 1300 510" />
      </svg>
    </div>
  );
}
