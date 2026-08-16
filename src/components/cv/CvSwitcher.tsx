"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { CvMode, Lang, SiteData } from "@/lib/types";
import { LABELS, revisionLabel } from "@/lib/cv";
import { ScheduleSheet } from "./ScheduleSheet";
import { DetailCv } from "./DetailCv";
import { SheetTopbar } from "./SheetTopbar";
import s from "./ScheduleSheet.module.css";

const SHEET_W = 1440;
const SHEET_H = 900;
/** Never scale below this: on phones the sheet scrolls horizontally instead of becoming a thumbnail. */
const MIN_SCALE = 0.5;
/** Below this container width the sheet would be scaled < 0.6 → start in Detail. */
const COMPACT_MIN_WIDTH = 900;
const ease = [0.16, 1, 0.3, 1] as const;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Scales the fixed 1440×900 sheet to the width of its container.
 * The wrapper's height follows the scale so layout below stays correct.
 */
function SheetViewport({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.max(MIN_SCALE, Math.min(1, el.clientWidth / SHEET_W)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="cv-viewport" style={{ height: SHEET_H * scale + 2 }}>
      <div
        className="cv-scaler"
        style={{
          width: SHEET_W,
          height: SHEET_H + 2,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
      {/* spacer so the scroll width matches the scaled sheet */}
      <div aria-hidden style={{ width: SHEET_W * scale, height: 1, marginTop: -1 }} />
    </div>
  );
}

export function CvSwitcher({ data }: { data: SiteData }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<CvMode>("compact");
  const [lang, setLang] = useState<Lang>(data.profile.defaultLang);
  const [narrow, setNarrow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const L = LABELS[lang];

  /* URL → state (once). Compact is always the default; ?view=detail / ?lang=en override. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const v = q.get("view");
    const l = q.get("lang");
    if (l === "vi" || l === "en") setLang(l);
    const isNarrow = window.innerWidth < COMPACT_MIN_WIDTH;
    setNarrow(isNarrow);
    if (v === "detail") setMode("detail");
    else if (v !== "compact" && isNarrow) {
      // Phone-sized screens: the dense sheet is unreadable → open Detail, keep Compact one tap away.
      setMode("detail");
      setShowHint(true);
    }
    const onResize = () => setNarrow(window.innerWidth < COMPACT_MIN_WIDTH);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* state → URL (replace, no navigation) */
  const sync = useCallback((m: CvMode, l: Lang) => {
    const q = new URLSearchParams(window.location.search);
    if (m === "compact") q.delete("view");
    else q.set("view", m);
    if (l === data.profile.defaultLang) q.delete("lang");
    else q.set("lang", l);
    const qs = q.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [data.profile.defaultLang]);

  const onMode = (m: CvMode) => {
    setMode(m);
    setShowHint(false);
    sync(m, lang);
  };
  const onLang = (l: Lang) => {
    setLang(l);
    sync(mode, l);
  };

  /* Keyboard: C / D toggle mode, V / E toggle language (ignored inside inputs) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "c") onMode("compact");
      else if (k === "d") onMode("detail");
      else if (k === "v") onLang("vi");
      else if (k === "e") onLang("en");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, lang]);

  const rev = revisionLabel(data.profile);
  const transition = reduce ? { duration: 0.15 } : { duration: 0.45, ease };

  return (
    <div className="cv-root">
      {showHint && narrow && (
        <div className="mx-auto mb-4 flex max-w-[1440px] items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-2.5 text-xs text-fg-muted">
          <span>{L.compactHint}</span>
          <button
            type="button"
            onClick={() => onMode("compact")}
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent"
          >
            <Maximize2 size={12} /> Compact
          </button>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {mode === "compact" ? (
          <motion.div
            key="compact"
            className="mx-auto max-w-[1440px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, transition: { duration: 0.25 } }}
            transition={transition}
          >
            {/* Print: exact sheet-sized page so "Save as PDF" gives one clean landscape sheet */}
            <style>{`@media print{@page{size:1442px 902px;margin:0}}`}</style>
            <SheetViewport>
              <ScheduleSheet data={data} lang={lang} mode={mode} onMode={onMode} onLang={onLang} />
            </SheetViewport>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            className="mx-auto max-w-[1440px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.25 } }}
            transition={transition}
          >
            <div className={`${s.sheet} cv-detail-frame`}>
              <SheetTopbar
                sheetId={data.profile.sheetId}
                revision={rev}
                mode={mode}
                lang={lang}
                onMode={onMode}
                onLang={onLang}
                suffix="DETAIL"
              />
              <div className="cv-detail-body">
                <DetailCv data={data} lang={lang} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
