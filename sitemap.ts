import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { ProfileCard } from "@/components/about/ProfileCard";
import { SkillBars } from "@/components/about/SkillBars";
import { Reveal } from "@/components/ui/motion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "Professional summary, experience and skills.",
};

function SectionTitle({ index, vi, en }: { index: string; vi: string; en: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">{index}</p>
      <h2 className="mt-2 font-display text-3xl font-light tracking-tight sm:text-4xl">
        <span className="vi">{vi}</span> <span className="en text-2xl sm:text-3xl">{en}</span>
      </h2>
    </div>
  );
}

export default async function AboutPage() {
  const { profile, experiences, education, skills } = await getSiteData();

  return (
    <div className="shell pb-10">
      <Reveal>
        <header className="mb-16 max-w-4xl">
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.95] tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-accent">
            {profile.role}
          </p>
        </header>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <ProfileCard profile={profile} />
          </Reveal>
        </div>

        <div className="min-w-0">
          {/* Summary */}
          <Reveal>
            <section className="mb-20">
              <SectionTitle index="01" vi="Tóm tắt chuyên môn" en="Summary" />
              <p className="vi text-lg leading-relaxed">{profile.summaryVI}</p>
              <p className="en mt-4 leading-relaxed">{profile.summaryEN}</p>
            </section>
          </Reveal>

          {/* Experience timeline */}
          <section className="mb-20">
            <Reveal>
              <SectionTitle index="02" vi="Lịch sử công việc" en="Experience" />
            </Reveal>
            <div className="relative space-y-10 border-l border-[var(--line)] pl-8">
              {experiences.map((e) => (
                <Reveal key={e.id}>
                  <div className="relative">
                    <span className="absolute -left-[34px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-[var(--paper)]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl tracking-tight">{e.company}</h3>
                      <span className="font-mono text-xs text-fg-faint">{e.timeframe}</span>
                    </div>
                    <p className="vi mt-1 text-sm">{e.roleVI}</p>
                    <p className="en text-sm">{e.roleEN}</p>
                    <ul className="mt-4 space-y-3">
                      {e.achievementsVI.map((a, i) => (
                        <li key={i}>
                          <span className="vi block text-sm leading-relaxed">{a}</span>
                          <span className="en block text-xs leading-relaxed">
                            {e.achievementsEN[i] ?? ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-20">
            <Reveal>
              <SectionTitle index="03" vi="Học vấn & khóa học" en="Education" />
            </Reveal>
            <div className="grid gap-4">
              {education.map((ed) => (
                <Reveal key={ed.id}>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--ink-soft)] p-5">
                    <h3 className="font-medium">{ed.name}</h3>
                    <p className="vi mt-1 text-sm text-fg-muted">{ed.descriptionVI}</p>
                    <p className="en text-xs">{ed.descriptionEN}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <Reveal>
              <SectionTitle index="04" vi="Kĩ năng phần mềm" en="Software skills" />
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
