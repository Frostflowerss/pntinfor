"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import type { Lang, SiteData } from "@/lib/types";
import { LABELS } from "@/lib/cv";
import { ScheduleSheet } from "./ScheduleSheet";

const SHEET_W = 1440;
const SHEET_H = 900;
/** Below this scale the sheet is unreadable → on portrait screens fit the height and pan instead. */
const READABLE_SCALE = 0.55;
const PAD = 12;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Fit = { scale: number; pan: boolean; portrait: boolean };

function computeFit(vw: number, vh: number): Fit {
  const w = Math.max(0, vw - PAD * 2);
  const h = Math.max(0, vh - PAD * 2);
  const contain = Math.min(w / SHEET_W, h / SHEET_H, 1);
  const portrait = vh > vw;
  if (contain < READABLE_SCALE && portrait) {
    // Phone held upright: fill the height, let the sheet scroll sideways like a drawing.
    return { scale: Math.min(h / SHEET_H, 1), pan: true, portrait };
  }
  return { scale: contain, pan: false, portrait };
}

/**
 * The CV as a standalone full-screen page.
 * - Desktop / laptop / tablet / landscape phone: the whole 1440×900 sheet is scaled to fit the screen.
 * - Portrait phone: fits the height and pans horizontally (readable), with a rotate hint.
 * - VI/EN persists in ?lang=; DETAIL (in the sheet topbar) navigates to the original site (/home).
 */
export function CvStage({ data }: { data: SiteData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit>({ scale: 1, pan: false, portrait: false });
  const [hintOpen, setHintOpen] = useState(true);
  const [lang, setLangState] = useState<Lang>(data.profile.defaultLang);

  useEffect(() => {
    const l = new URLSearchParams(window.location.search).get("lang");
    if (l === "vi" || l === "en") setLangState(l);
  }, []);

  useIsoLayoutEffect(() => {
    const update = () => setFit(computeFit(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

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

  const L = LABELS[lang];
  const w = SHEET_W * fit.scale;
  const h = SHEET_H * fit.scale + 2;

  return (
    <div ref={ref} className={`cv-fit${fit.pan ? " cv-fit-pan" : ""}`}>
      {/* Print: exact sheet-sized page so "Save as PDF" gives one clean landscape sheet */}
      <style>{`@media print{@page{size:1442px 902px;margin:0}}`}</style>

      <div className="cv-fit-inner" style={{ width: w, height: h }}>
        <div
          className="cv-scaler"
          style={{
            width: SHEET_W,
            height: SHEET_H + 2,
            transform: `scale(${fit.scale})`,
            transformOrigin: "top left",
          }}
        >
          <ScheduleSheet data={data} lang={lang} onLang={setLang} />
        </div>
      </div>

      {fit.pan && hintOpen && (
        <div className="cv-hint" role="status">
          <RotateCcw size={13} className="shrink-0 text-accent" />
          <span>{L.rotateHint}</span>
          <button type="button" onClick={() => setHintOpen(false)} aria-label="Close" className="cv-hint-x">
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
