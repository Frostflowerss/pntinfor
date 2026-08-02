"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";

/**
 * Ranh giới lỗi cho toàn bộ site công khai.
 * Trước đây không có file này: Supabase lỗi là rơi thẳng vào trang lỗi mặc định
 * của Next, mất hết header/footer và không có đường thử lại.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] render error:", error);
  }, [error]);

  return (
    <div className="shell grid place-items-center py-32 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">Error</p>
        <h1 className="mt-4 font-display text-4xl font-light tracking-tight sm:text-5xl">
          <span className="vi">Đã có lỗi xảy ra</span>
        </h1>
        <p lang="en" className="en mt-3 text-sm">
          Something went wrong while loading this page.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-[var(--paper)]"
          >
            <RotateCw size={15} aria-hidden />
            Thử lại / Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-fg-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
          >
            Về trang chủ / Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-[10px] tracking-widest text-fg-faint">
            REF {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
