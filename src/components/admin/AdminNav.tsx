"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Briefcase, GraduationCap, Wrench, LayoutGrid, Images, LogOut, ExternalLink } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/pntarch/projects", label: "Dự án", icon: LayoutGrid },
  { href: "/pntarch/profile", label: "Hồ sơ & Trang chủ", icon: User },
  { href: "/pntarch/experience", label: "Kinh nghiệm", icon: Briefcase },
  { href: "/pntarch/education", label: "Học vấn", icon: GraduationCap },
  { href: "/pntarch/skills", label: "Kĩ năng", icon: Wrench },
  { href: "/pntarch/gallery", label: "Thư viện", icon: Images },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
              active ? "bg-[var(--accent-soft)] text-accent" : "text-fg-muted hover:bg-white/5 hover:text-fg"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
      <div className="my-2 h-px bg-[var(--line)]" />
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted transition hover:bg-white/5 hover:text-fg"
      >
        <ExternalLink size={16} />
        Xem website
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </form>
    </nav>
  );
}
