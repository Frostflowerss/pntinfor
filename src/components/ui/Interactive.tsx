"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** True only on devices with a precise pointer (mouse/trackpad). */
export function usePointerFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return fine;
}

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  if (reduce || !fine) return <div className={cn("inline-block", className)}>{children}</div>;

  // Measure inside the rAF: superseded moves never reach the frame, so reading
  // layout for them only forces a synchronous reflow for a discarded value.
  function onMove(e: React.MouseEvent) {
    const cx = e.clientX, cy = e.clientY;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set((cx - (r.left + r.width / 2)) * strength);
      y.set((cy - (r.top + r.height / 2)) * strength);
    });
  }
  function reset() {
    cancelAnimationFrame(raf.current);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x, y }} className={cn("inline-block", className)}>
      {children}
    </motion.div>
  );
}

export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  if (reduce || !fine) return <div className={className}>{children}</div>;

  // One instance renders per project card, so keep the layout read batched into
  // the frame that actually consumes it.
  function onMove(e: React.MouseEvent) {
    const cx = e.clientX, cy = e.clientY;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (cx - r.left) / r.width - 0.5;
      const py = (cy - r.top) / r.height - 0.5;
      ry.set(px * max);
      rx.set(-py * max);
    });
  }
  function reset() {
    cancelAnimationFrame(raf.current);
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
