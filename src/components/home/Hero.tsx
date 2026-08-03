"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";
import { Magnetic, Tilt } from "@/components/ui/Interactive";
import { MouseParallax, ScrollParallax } from "@/components/ui/Parallax";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Profile } from "@/lib/types";

export function Hero({ profile }: { profile: Profile }) {
  const words = profile.name.split(" ");
  const avatarRatio = (profile.avatarAspect || "4/5").replace("/", " / ");

  return (
    <section className="relative isolate overflow-hidden">
      <Spotlight className="pointer-events-none absolute inset-0 -z-10" />

      <div className="shell pb-20 pt-10 sm:pb-28">
        <div className="hero-fade-up mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
          <span className="h-px w-10 bg-accent" />
          {[profile.role, profile.locationLabel].filter(Boolean).join(" · ")}
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <MouseParallax strength={8}>
              <h1 className="font-display text-[clamp(2.75rem,9vw,7rem)] font-light leading-[0.92] tracking-[-0.02em]">
              {words.map((w, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="hero-rise block" style={{ animationDelay: `${i * 0.09}s` }}>
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            </MouseParallax>

            {/* Đoạn này là phần tử LCP của trang chủ. Cố tình KHÔNG có hiệu ứng
                vào: mọi cách làm mờ dần đều đẩy lùi LCP đúng bằng thời lượng
                hiệu ứng cộng thời gian hydrate. */}
            <p className="mt-8 max-w-xl text-balance text-base leading-relaxed sm:text-lg">
              <span className="vi block">{profile.homeSublineVI}</span>
              <span lang="en" className="en mt-2 block text-sm sm:text-base">{profile.homeSublineEN}</span>
            </p>

            <div
              className="hero-fade-up mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.25s" }}
            >
              <Magnetic>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-[var(--paper)] transition-transform"
                >
                  Xem dự án / View work
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link
                  href="/about"
                  className="link-underline inline-flex items-center gap-2 px-2 py-3.5 text-sm text-fg-muted hover:text-fg"
                >
                  Về tôi / About
                </Link>
              </Magnetic>
            </div>
          </div>

          <ScrollParallax distance={42} className="flex justify-center lg:justify-end">
            <MouseParallax strength={22}>
              <Tilt max={7}>
                {/* Ảnh này mang priority, tức là ứng viên LCP trên màn rộng.
                    Không bọc nó trong hiệu ứng mờ dần nữa — trước đây delay
                    0.4s + fade 1s làm chính ảnh được ưu tiên lại hiện sau cùng. */}
                <div
                  style={{ aspectRatio: avatarRatio }}
                  className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--line)] shadow-2xl shadow-black/40"
                >
                  <SmartImage
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="(max-width:1024px) 80vw, 360px"
                    className="object-cover"
                    wrapperClassName="absolute inset-0"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest text-white/80">
                    {profile.locationLabel}
                  </div>
                </div>
              </Tilt>
            </MouseParallax>
          </ScrollParallax>
        </div>
      </div>
    </section>
  );
}
