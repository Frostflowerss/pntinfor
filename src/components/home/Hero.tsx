"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";
import { Magnetic } from "@/components/ui/Interactive";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Profile } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ profile }: { profile: Profile }) {
  const words = profile.name.split(" ");

  return (
    <section className="relative isolate overflow-hidden">
      <div className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <Spotlight className="pointer-events-none absolute inset-0 -z-10" />

      <div className="shell pb-20 pt-10 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint"
        >
          <span className="h-px w-10 bg-accent" />
          Architect · BIM Coordinator · Ha Noi
        </motion.div>

        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="font-display text-[clamp(2.75rem,9vw,7rem)] font-light leading-[0.92] tracking-[-0.02em]">
              {words.map((w, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.09 }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 max-w-xl text-balance text-base leading-relaxed sm:text-lg"
            >
              <span className="vi block">{profile.homeSublineVI}</span>
              <span className="en mt-2 block text-sm sm:text-base">{profile.homeSublineEN}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-10 flex flex-wrap items-center gap-4"
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            className="relative aspect-[4/5] w-full max-w-sm justify-self-end overflow-hidden rounded-2xl border border-[var(--line)]"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
