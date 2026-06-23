"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** B5 "Clip-path wipe": each route reveals behind a diagonal cut. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ willChange: "clip-path, opacity" }}
      initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 }}
      animate={{ clipPath: "polygon(0 0, 115% 0, 100% 100%, 0 100%)", opacity: 1 }}
      transition={{ clipPath: { duration: 0.7, ease }, opacity: { duration: 0.35 } }}
    >
      {children}
    </motion.div>
  );
}
