"use client";

import { Printer } from "lucide-react";

/** Triggers the browser print dialog (Save as PDF). Hidden in the printout. */
export function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="In hoặc xuất PDF"
      className={`no-print inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-fg-muted transition-colors hover:border-[var(--accent)] hover:text-fg ${className}`}
    >
      <Printer size={15} />
      In / Export PDF
    </button>
  );
}
