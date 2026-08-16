"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import s from "./ModeSwitch.module.css";

/**
 * Compact / Detail switch for the original website's header (top-right, at the clock's spot).
 * COMPACT → the CV at "/" ; DETAIL = the current site (active).
 */
export function ModeSwitch({ className }: { className?: string }) {
  return (
    <div className={cn(s.seg, className)} role="group" aria-label="View">
      <Link href="/" className={s.btn} prefetch>
        COMPACT
      </Link>
      <span className={cn(s.btn, s.on)} aria-current="page">
        DETAIL
      </span>
    </div>
  );
}
