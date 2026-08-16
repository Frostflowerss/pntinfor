"use client";

import { cn } from "@/lib/utils";
import { useCvView } from "./CvViewProvider";
import s from "./ModeSwitch.module.css";

/** The Compact / Detail switch. Same look everywhere; reads/writes the shared CV view. */
export function ModeSwitch({ className }: { className?: string }) {
  const { mode, setMode } = useCvView();
  return (
    <div className={cn(s.seg, className)} role="tablist" aria-label="CV view">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "compact"}
        className={cn(s.btn, mode === "compact" && s.on)}
        onClick={() => setMode("compact")}
      >
        COMPACT
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "detail"}
        className={cn(s.btn, mode === "detail" && s.on)}
        onClick={() => setMode("detail")}
      >
        DETAIL
      </button>
    </div>
  );
}
