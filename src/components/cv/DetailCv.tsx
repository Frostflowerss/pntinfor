"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProfileCard } from "@/components/about/ProfileCard";
import { SkillBars } from "@/components/about/SkillBars";
import { Reveal } from "@/components/ui/motion";
import { classShort } from "@/lib/utils";
import { LABELS, pick } from "@/lib/cv";
import type { Lang, SiteData } from "@/lib/types";

/**
 * Bilingual line: the selected language is primary (large, .vi tone),
 * the other language follows in the smaller accent (.en) tone.
 */
function Bi({
  vi,
  en,
  lang,
  className = "",
  primaryClass = "",
  secondaryClass = "",
}: {
  vi: string;
  en: string;
  lang: Lang;
  className?: string;
  primaryClass?: string;
  secondaryClass?: string;
}) {
  const primary = pick(lang, vi, en);
  const secondary = pick(lang, en, vi);
  return (
    <span className={className}>
      <span className={`vi block ${primaryClass}`}>{primary}</span>
      {secondary && secondary !== primary && (
        <span className={`en block ${secondaryClass}`}>{secondary}</span>
      )}
    </span>
  );
}

function SectionTitle({ index, vi, en, lang }: { index: string; vi: string; en: string; lang: Lang }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">{index}</p>
      <h2 className="mt-2 font-display text-3xl font-light tracking-tight sm:text-4xl">
        <span className="vi">{pick(lang, vi, en)}</span>{" "}
        <span className="en text-2xl sm:text-3xl">{pick(lang, en, vi)}</span>
      </h2>
    </div>
  );
}

export function DetailCv({ data, lang }: { data: SiteData; lang: Lang }) {
  const { profile, experiences, education, skills, projects } = data;
  const L = LABELS[lang];

  return (
    <div className="pb-4">
      <Reveal>
        <header className="mb-16 max-w-4xl">
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.95] tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-accent">
            {profile.spineRoles || profile.role}
          </p>
        </header>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <ProfileCard profile={profile} lang={lang} />
          </Reveal>
        </div>

        <div className="min-w-0">
          {/* 01 Summary */}
          <Reveal>
            <section className="mb-20">
              <SectionTitle index="01" vi="Tóm tắt chuyên môn" en="Summary" lang={lang} />
              <Bi
                vi={profile.summaryVI}
                en={profile.summaryEN}
                lang={lang}
                primaryClass="text-lg leading-relaxed"
                secondaryClass="mt-4 leading-relaxed"
              />
            </section>
          </Reveal>

          {/* 03 Experience */}
          <section className="mb-20">
            <Reveal>
              <SectionTitle index="03" vi="Lịch sử công việc" en="Experience" lang={lang} />
            </Reveal>
            <div className="relative space-y-10 border-l border-[var(--line)] pl-8">
              {experiences.map((e) => {
                const items = lang === "vi" ? e.achievementsVI : e.achievementsEN;
                const others = lang === "vi" ? e.achievementsEN : e.achievementsVI;
                return (
                  <Reveal key={e.id}>
                    <div className="relative">
                      <span className="absolute -left-[34px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-[var(--paper)]" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-xl tracking-tight">{e.company}</h3>
                        <span className="font-mono text-xs text-fg-faint">{e.timeframe}</span>
                      </div>
                      <Bi vi={e.roleVI} en={e.roleEN} lang={lang} className="mt-1 block" primaryClass="text-sm" secondaryClass="text-sm" />
                      <ul className="mt-4 space-y-3">
                        {items.map((a, i) => (
                          <li key={i}>
                            <span className="vi block text-sm leading-relaxed">{a}</span>
                            {others[i] && (
                              <span className="en block text-xs leading-relaxed">{others[i]}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* 04 Education */}
          <section className="mb-20">
            <Reveal>
              <SectionTitle index="04" vi="Học vấn & khóa học" en="Education" lang={lang} />
            </Reveal>
            <div className="grid gap-4">
              {education.map((ed) => (
                <Reveal key={ed.id}>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--ink-soft)] p-5">
                    <h3 className="font-medium">{ed.name}</h3>
                    <Bi
                      vi={ed.descriptionVI}
                      en={ed.descriptionEN}
                      lang={lang}
                      className="mt-1 block"
                      primaryClass="text-sm text-fg-muted"
                      secondaryClass="text-xs"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 05 Projects */}
          {projects.length > 0 && (
            <section className="mb-20">
              <Reveal>
                <SectionTitle index="05" vi="Dự án" en="Projects" lang={lang} />
              </Reveal>
              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {projects.map((p, i) => {
                  const cls = classShort(pick(lang, p.constructionClassVI, p.constructionClassEN));
                  return (
                    <Reveal key={p.id} y={12}>
                      <Link
                        href={`/work/${p.slug}`}
                        className="group grid grid-cols-[34px_1fr_auto] items-start gap-4 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] sm:grid-cols-[34px_1fr_220px_24px]"
                      >
                        <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                        <span className="min-w-0">
                          <span className="vi block font-medium leading-snug transition-colors group-hover:text-accent">
                            {pick(lang, p.titleVI, p.titleEN)}
                          </span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-faint">
                            {L.classPrefix} {cls} · {pick(lang, p.locationVI, p.locationEN)}
                          </span>
                        </span>
                        <span className="hidden text-xs leading-relaxed text-fg-muted sm:block">
                          {pick(lang, p.primaryRoleVI, p.primaryRoleEN)}
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="hidden text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                        />
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          )}

          {/* 06 Skills */}
          <section>
            <Reveal>
              <SectionTitle index="06" vi="Kĩ năng phần mềm" en="Software skills" lang={lang} />
            </Reveal>
            <Reveal>
              <SkillBars skills={skills} />
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
