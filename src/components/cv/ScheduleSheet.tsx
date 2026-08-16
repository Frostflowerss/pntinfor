"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Lang, SiteData } from "@/lib/types";
import {
  LABELS,
  LEVEL_CODE,
  buildTimeline,
  classMix,
  pick,
  projectRows,
  revisionLabel,
  roleCoverage,
  skillShort,
  spineLines,
  uniqueProvinces,
  type Zoom,
} from "@/lib/cv";
import { SheetTopbar } from "./SheetTopbar";
import s from "./ScheduleSheet.module.css";

const PER_PAGE = 12;
const MAX_SKILLS = 11;

const NAV = [
  { href: "/home", label: "HOME" },
  { href: "/", label: "CV" },
  { href: "/work", label: "WORK" },
  { href: "/gallery", label: "GALLERY" },
];

const CELL_TONE = [s.cell0, s.cell1, s.cell2, s.cell3];

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 18v-6" />
      <path d="m9 15 3 3 3-3" />
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z" />
    </svg>
  );
}
function IconPrint() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  );
}

export function ScheduleSheet({
  data,
  lang,
  onLang,
}: {
  data: SiteData;
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  const { profile, experiences, education, skills, projects } = data;
  const L = LABELS[lang];
  const [zoom, setZoom] = useState<Zoom>("all");
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const rows = useMemo(() => projectRows(projects, lang), [projects, lang]);
  const mix = useMemo(() => classMix(rows, lang), [rows, lang]);
  const roles = useMemo(() => roleCoverage(rows), [rows]);
  const provinces = useMemo(() => uniqueProvinces(rows), [rows]);
  const tl = useMemo(
    () => buildTimeline(experiences, education, lang, zoom),
    [experiences, education, lang, zoom]
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const pg = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(pg * PER_PAGE, pg * PER_PAGE + PER_PAGE);
  const pageLabel =
    `${pg * PER_PAGE + 1}–${Math.min(rows.length, (pg + 1) * PER_PAGE)} / ${rows.length}` +
    (pageCount > 1 ? `  ·  ${L.page} ${pg + 1}/${pageCount}` : "");

  const shownSkills = skills.slice(0, MAX_SKILLS);
  const spine = spineLines(profile);
  const rev = revisionLabel(profile);
  const busy = profile.status === "busy";
  const summary = pick(lang, profile.summaryVI, profile.summaryEN);
  const addr = pick(lang, profile.addressVI, profile.addressEN);
  const zoomAllLabel = zoom === "all" ? tl.spanLabel.replace(" — ", " → ") : L.zoomAll;

  function go(delta: number) {
    setDir(delta);
    setPage((p) => Math.max(0, Math.min(pageCount - 1, p + delta)));
  }

  return (
    <div className={s.sheet} data-lang={lang}>
      <SheetTopbar sheetId={profile.sheetId} revision={rev} lang={lang} onLang={onLang} />

      <div className={s.body} key={lang}>
        <div className={s.bodyGrid}>
          {/* ---------- vertical spine ---------- */}
          <aside className={s.spine}>
            <nav className={s.spineNav} aria-label="Sheet navigation">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} aria-current={n.href === "/" ? "page" : undefined}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <span className={s.spineName}>{profile.name}</span>
            <span className={s.spineMeta}>
              {spine.roles && <span className={s.spineRoles}>{spine.roles}</span>}
              {spine.services && <span className={s.spineServices}>{spine.services}</span>}
            </span>
          </aside>

          {/* ---------- content ---------- */}
          <div className={s.content}>
            {/* 01 summary + portfolio breakdown */}
            <div className={s.head}>
              <div className={s.summary}>
                <p className={s.label}>01 / {L.sum}</p>
                <p className={s.summaryText}>{summary}</p>
              </div>
              <div className={s.mix}>
                <div className={s.mixHead}>
                  <p className={s.mixTitle}>{L.mixTitle}</p>
                  <span className={s.mixMeta}>
                    {rows.length} {L.projects} · {provinces.length} {L.provinces}
                  </span>
                </div>
                <div className={s.mixGrid}>
                  <div>
                    <p className={s.subLabel}>{L.clsTitle}</p>
                    <div className={s.cells}>
                      {mix.map((m, i) => (
                        <div
                          key={m.key}
                          className={cn(s.cell, CELL_TONE[m.tone] ?? s.cell3)}
                          style={{ animationDelay: `${i * 70}ms` }}
                          title={`${m.label}: ${m.n}`}
                        >
                          <span className={s.cellN}>{m.n}</span>
                          <span className={s.cellK}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={cn(s.subLabel, s.subLabelTight)}>{L.roleTitle}</p>
                    <div className={s.roles}>
                      {roles.map((r, i) => (
                        <div key={r.key}>
                          <div className={s.roleRow}>
                            <span className={s.roleK}>{r.key}</span>
                            <span className={s.roleN}>
                              {r.n}/{r.total}
                            </span>
                          </div>
                          <div className={s.roleTrack}>
                            <div
                              className={s.roleFill}
                              style={{ width: `${r.pct}%`, animationDelay: `${240 + i * 90}ms` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={s.locLine} title={provinces.join(" · ")}>
                  {provinces.join(" · ")}
                </div>
              </div>
            </div>

            {/* 03 + 04 timeline */}
            <div className={s.tl}>
              <div className={s.tlHead}>
                <p className={s.label}>03 / {L.exp}</p>
                <span className={s.swSolid} aria-hidden />
                <p className={s.label}>04 / {L.edu}</p>
                <span className={s.swHollow} aria-hidden />
                <span className={s.tlZoom} role="tablist" aria-label="Timeline zoom">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={zoom === "all"}
                    className={cn(s.segBtn, s.segBtnSm, zoom === "all" && s.segBtnOn)}
                    onClick={() => setZoom("all")}
                  >
                    {zoomAllLabel}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={zoom === "recent"}
                    className={cn(s.segBtn, s.segBtnSm, zoom === "recent" && s.segBtnOn)}
                    onClick={() => setZoom("recent")}
                  >
                    {L.zoomRecent}
                  </button>
                </span>
              </div>

              <div className={s.tlBody}>
                <div className={s.tlRow}>
                  <div />
                  <div className={s.tlAxis}>
                    {tl.ticks.map((t) => (
                      <span
                        key={t.year}
                        className={cn(s.tick, t.major && s.tickMajor)}
                        style={{ left: `${t.left}%` }}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div key={zoom}>
                  {tl.jobs.map((j) => (
                    <div key={j.id} className={s.jobRow}>
                      <div className={s.jobLbl}>
                        <div className={s.jobCo}>{j.company}</div>
                        <div className={s.jobRole}>{j.role}</div>
                      </div>
                      <div className={s.jobLane}>
                        <span
                          className={cn(s.jobBar, j.current && s.jobBarCur)}
                          style={{
                            left: `${j.left}%`,
                            width: `${j.width}%`,
                            background: j.current
                              ? "var(--acc)"
                              : `color-mix(in srgb, var(--acc) ${Math.round(42 + j.tone * 20)}%, transparent)`,
                            animationDelay: `${j.delay}ms`,
                          }}
                        />
                        <span
                          className={cn(s.jobTag, j.current && s.jobTagCur)}
                          style={{ left: `${j.labelLeft}%` }}
                        >
                          {j.label}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className={s.eduRow}>
                    <div className={s.eduLbl}>
                      <div className={s.eduLbl1}>{L.edu}</div>
                      <div className={s.eduLbl2}>{tl.eduMeta}</div>
                    </div>
                    <div className={s.eduLane}>
                      {tl.degrees.map((d) => (
                        <div key={d.id}>
                          <span className={s.degBar} style={{ left: `${d.left}%`, width: `${d.width}%` }} />
                          <div className={s.degLbl} style={{ left: `${d.left}%` }}>
                            <span className={s.eduName}>{d.short}</span>
                            <span className={s.eduIssuer}>{d.issuer}</span>
                          </div>
                        </div>
                      ))}
                      {tl.courses.map((c) => (
                        <div key={c.id}>
                          <span
                            className={s.diamond}
                            style={{ left: `${c.left}%`, animationDelay: `${c.delay}ms` }}
                          />
                          <span className={s.diamondYear} style={{ left: `calc(${c.left}% + 9px)` }}>
                            {c.year}
                          </span>
                          <div
                            className={s.courseLbl}
                            style={{ left: `calc(${c.left}% - 5px)`, maxWidth: `calc(${c.maxW}% - 12px)` }}
                          >
                            <span className={s.eduName}>{c.name}</span>
                            <span className={s.eduIssuer}>{c.issuer}</span>
                            {c.more > 0 && (
                              <span className={s.moreChip}>
                                +{c.more} {L.more}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={s.drops} aria-hidden>
                    {tl.drops.map((d, i) => (
                      <span
                        key={i}
                        className={cn(s.drop, d.strong && s.dropStrong)}
                        style={{ left: `${d.left}%`, animationDelay: `${d.delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 05 projects  |  06 skills + 02 contact */}
            <div className={s.bottom}>
              <div className={s.projects}>
                <div className={s.secHead}>
                  <p className={s.label}>05 / {L.prj}</p>
                  <span className={s.secMeta}>
                    {L.pName} · {L.pLoc} · {L.pClass}
                  </span>
                </div>
                <div className={s.pjGridWrap}>
                  <div
                    className={s.pjGrid}
                    key={`${pg}-${lang}`}
                    style={{ "--dir": `${dir * 12}px` } as React.CSSProperties}
                  >
                    {pageRows.map((p) => (
                      <Link
                        key={p.id}
                        href={`/work/${p.slug}`}
                        className={s.pjRow}
                        title={`${p.title} — ${p.clsFull}`}
                      >
                        <span className={s.pjN}>{p.n}</span>
                        <span className={s.pjMain}>
                          <span className={s.pjTitle} style={{ display: "block" }}>
                            {p.title}
                          </span>
                          <span className={s.pjSub} style={{ display: "block" }}>
                            {p.loc} · {p.role}
                          </span>
                        </span>
                        <span className={cn(s.chip, p.isTop && s.chipTop)}>{p.chip}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={s.pager}>
                  <span className={s.pagerLbl}>{pageLabel}</span>
                  <div className={s.pagerBtns}>
                    <button
                      type="button"
                      className={s.pagerBtn}
                      onClick={() => go(-1)}
                      disabled={pg === 0}
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={s.pagerBtn}
                      onClick={() => go(1)}
                      disabled={pg >= pageCount - 1}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>

              <div className={s.side}>
                <div className={s.secHead}>
                  <p className={s.label}>06 / {L.skl}</p>
                  <span className={s.sklCount}>
                    +{skills.length} {L.items}
                  </span>
                </div>
                <div className={s.skills}>
                  {shownSkills.map((sk, i) => {
                    const code = LEVEL_CODE[sk.level] ?? "SKI";
                    return (
                      <div key={sk.id} className={s.sk}>
                        <span className={s.skName} title={sk.title}>
                          {skillShort(sk)}
                        </span>
                        <div className={s.skTrack}>
                          <div
                            className={cn(s.skFill, s[`sk${code}` as keyof typeof s])}
                            style={{ width: `${sk.percent}%`, animationDelay: `${180 + i * 45}ms` }}
                          />
                          <span className={s.skTicks} aria-hidden />
                        </div>
                        <span className={s.skLvl}>{code}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={s.legend}>
                  <div className={s.legendBar} />
                  <div className={s.legendRow}>
                    {(["BAS", "SKI", "ADV", "EXP"] as const).map((c, i) => (
                      <span key={c} className={s.legendItem}>
                        <b>{c}</b>
                        <span>{L.lv[i]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={s.contact}>
                  <p className={s.label}>02 / {L.con}</p>
                  <div className={s.contactLines}>
                    {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
                    {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
                    {addr && <span className={s.addr}>{addr}</span>}
                  </div>
                  <div className={s.actions}>
                    {profile.cvUrl ? (
                      <a href={profile.cvUrl} target="_blank" rel="noreferrer" className={s.btnCv}>
                        <IconDownload />
                        {L.cv}
                      </a>
                    ) : (
                      <span className={cn(s.btnCv, s.btnCvOff)} title="No PDF uploaded yet">
                        <IconDownload />
                        {L.cv}
                      </span>
                    )}
                    <button type="button" className={s.btnPrint} onClick={() => window.print()}>
                      <IconPrint />
                      {L.print}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- title block ---------- */}
        <div className={s.titleBlock}>
          <div className={s.tb}>
            <div className={s.tbK}>DOCUMENT</div>
            <div className={s.tbV}>CURRICULUM VITAE</div>
          </div>
          <div className={s.tb}>
            <div className={s.tbK}>SHEET</div>
            <div className={s.tbV}>{profile.sheetId} / 01</div>
          </div>
          <div className={s.tb}>
            <div className={s.tbK}>SPAN</div>
            <div className={s.tbV}>{tl.spanLabel}</div>
          </div>
          <div className={s.tb}>
            <div className={s.tbK}>DRAWN BY</div>
            <div className={s.tbV}>{initials(profile.name)}</div>
          </div>
          <div className={s.tb}>
            <div className={s.tbK}>LOCATION</div>
            <div className={s.tbV}>{profile.locationLabel.toUpperCase()}</div>
          </div>
          <div className={s.tb}>
            <div className={s.tbK}>STATUS</div>
            <div className={cn(s.tbV, s.status, busy ? s.statusBusy : s.statusOpen)}>
              <span className={s.dot} aria-hidden />
              {busy ? "BUSY" : "OPEN TO WORK"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
