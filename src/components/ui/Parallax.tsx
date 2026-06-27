"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { usePointerFine } from "./Interactive";
import { cn } from "@/lib/utils";

/**
 * Layered cursor parallax — shifts children opposite to the pointer to
 * create depth between foreground/background layers. GPU transform only,
 * disabled on touch / reduced-motion.
 */
export function MouseParallax({
  children,
  strength = 16,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const y = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (reduce || !fine) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -strength * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * -strength * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, fine, strength, mx, my]);

  if (reduce || !fine) return <div className={className}>{children}</div>;
  return (
    <motion.div style={{ x, y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll-linked vertical drift — gives a spatial "walkthrough" feel as
 * sections move through the viewport. Transform only, off on reduced-motion.
 */
export function ScrollParallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div ref={ref} style={{ y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
