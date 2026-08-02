import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[clamp(5rem,20vw,12rem)] font-light leading-none tracking-tight text-accent">
          404
        </p>
        <p className="vi mt-4 text-lg">Không tìm thấy trang.</p>
        <p lang="en" className="en text-sm">This page could not be found.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-fg px-6 py-3 text-sm font-medium text-[var(--paper)]"
        >
          Về trang chủ / Back home
        </Link>
      </div>
    </div>
  );
}
