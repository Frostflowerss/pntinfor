"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, User, LayoutGrid, Images, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/work", label: "Work", icon: LayoutGrid },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/#contact", label: "Contact", icon: Mail },
];

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Saigon",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    tick();
    // Đồng hồ chỉ hiển thị giờ:phút nên nhịp 1s là 59 lần re-render thừa mỗi
    // phút cho một chi tiết trang trí. Căn đúng mốc chuyển phút rồi chạy 60s.
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="no-print pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      {/* Nav là thanh nổi cố định, người dùng bàn phím phải tab qua nó ở mọi
          trang. Link này chỉ hiện khi được focus. */}
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--paper)]"
      >
        Bỏ qua điều hướng / Skip to content
      </a>
      <div className="shell flex items-center justify-between" style={{ "--max": "76rem" } as React.CSSProperties}>
        <div className="pointer-events-auto hidden font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint sm:block">
          Ha Noi
        </div>

        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5 shadow-2xl shadow-black/30"
        >
          {NAV.map(({ href, label, icon: Icon }) => {
            // "/#contact" là neo trong trang chủ, không bao giờ là route đang mở.
            const active =
              href.includes("#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                // Dưới breakpoint sm nhãn bị ẩn và chỉ còn icon SVG trần, nên
                // link không có tên cho screen reader. aria-label luôn hiện diện
                // để bù, còn icon thì ẩn khỏi cây trợ năng cho khỏi đọc trùng.
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors sm:px-4",
                  active ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--accent-soft)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} aria-hidden className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-[var(--line)]" />
          <ThemeToggle />
        </motion.nav>

        <div className="pointer-events-auto hidden font-mono text-[11px] tabular-nums tracking-[0.2em] text-fg-faint sm:block">
          <Clock />
        </div>
      </div>
    </header>
  );
}
