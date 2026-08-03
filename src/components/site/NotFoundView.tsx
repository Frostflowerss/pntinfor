import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Giao diện 404 dùng chung.
 *
 * Cần hai file not-found: app/not-found.tsx bắt các URL không khớp route nào,
 * còn app/(site)/not-found.tsx bắt notFound() gọi từ trong nhóm (site) — bản
 * này mới có header/footer. Nếu chỉ đặt trong nhóm, URL lạ sẽ rơi vào trang
 * 404 mặc định trần trụi của Next.
 */
export function NotFoundView() {
  return (
    <div className="shell grid place-items-center py-24 text-center">
      <div>
        <p
          aria-hidden
          className="font-display text-[clamp(4rem,16vw,10rem)] font-light leading-none tracking-tight text-accent"
        >
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-light tracking-tight sm:text-4xl">
          <span className="vi">Không tìm thấy trang</span>
        </h1>
        <p lang="en" className="en mt-2 text-sm">
          This page could not be found.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-[var(--paper)]"
          >
            Về trang chủ / Home
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm text-fg-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
          >
            Xem dự án / Browse work
            <ArrowRight
              size={15}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
