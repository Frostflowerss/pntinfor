"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Lang, SiteData } from "@/lib/types";
import { useCvView } from "./CvViewProvider";
import { ScheduleSheet } from "./ScheduleSheet";
import { DetailCv } from "./DetailCv";

const SHEET_W = 1440;
const SHEET_H = 900;
/** Never scale below this: on phones the sheet scrolls horizontally instead of becoming a thumbnail. */
const MIN_SCALE = 0.5;
const ease = [0.16, 1, 0.3, 1] as const;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Scales the fixed 1440×900 sheet to the width of its container. */
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
      <div aria-hidden style={{ width: SHEET_W * scale, height: 1, marginTop: -1 }} />
    </div>
  );
}

/**
 * COMPACT  → full-screen CV schedule sheet (site chrome hidden via data-cv CSS).
 * DETAIL   → the original site About layout, with the normal header/footer visible.
 * The Compact/Detail switch lives in the sheet topbar (compact) and in the site
 * header at the clock position (detail); both drive the shared CvView.
 */
export function CvSwitcher({ data }: { data: SiteData }) {
  const reduce = useReducedMotion();
  const { mode } = useCvView();
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return data.profile.defaultLang;
    const l = new URLSearchParams(window.location.search).get("lang");
    return l === "vi" || l === "en" ? l : data.profile.defaultLang;
  });

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      const params = new URLSearchParams(window.location.search);
      if (l === data.profile.defaultLang) params.delete("lang");
      else params.set("lang", l);
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    },
    [data.profile.defaultLang]
  );

  const transition = reduce ? { duration: 0.15 } : { duration: 0.4, ease };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode === "compact" ? (
        <motion.div
          key="compact"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          transition={transition}
        >
          {/* Print: exact sheet-sized page so "Save as PDF" gives one clean landscape sheet */}
          <style>{`@media print{@page{size:1442px 902px;margin:0}}`}</style>
          <div className="mx-auto max-w-[1440px]">
            <SheetViewport>
              <ScheduleSheet data={data} lang={lang} onLang={setLang} />
            </SheetViewport>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="detail"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
          transition={transition}
        >
          <DetailCv data={data} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
