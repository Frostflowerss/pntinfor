import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteData } from "@/lib/data";

export async function Footer() {
  const { profile } = await getSiteData();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-[var(--line)]">
      <div className="shell flex flex-col gap-10 py-14">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
              Let&apos;s build something
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              {profile.name}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">{profile.role}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="link-underline inline-flex items-center gap-1 text-fg-muted hover:text-fg"
              >
                {profile.email} <ArrowUpRight size={14} />
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="link-underline text-fg-muted hover:text-fg"
              >
                {profile.phone}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] pt-6 text-xs text-fg-faint sm:flex-row sm:items-center">
          <span>© {year} {profile.name}. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-fg">About</Link>
            <Link href="/work" className="hover:text-fg">Work</Link>
            <Link href="/gallery" className="hover:text-fg">Gallery</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
