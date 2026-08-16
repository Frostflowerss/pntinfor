"use client";

import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/types";
import { useCvView } from "./CvViewProvider";
import s from "./ScheduleSheet.module.css";

/** Topbar for the compact sheet: brand + sheet id, Compact/Detail switch, and VI/EN. */
export function SheetTopbar({
  sheetId,
  revision,
  lang,
  onLang,
  suffix = "SCHEDULE SHEET",
}: {
  sheetId: string;
  revision: string;
  lang: Lang;
  onLang: (l: Lang) => void;
  suffix?: string;
}) {
  const { mode, setMode } = useCvView();
  return (
    <div className={s.topbar}>
      <div className={s.topbarL}>
        <span className={s.mark} aria-hidden>
          T
        </span>
        <span className={s.sheetId}>
          {sheetId} · {revision} · {suffix}
        </span>
      </div>
      <div className={s.topbarR}>
        <div className={s.seg} role="tablist" aria-label="View mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "compact"}
            className={cn(s.segBtn, mode === "compact" && s.segBtnOn)}
            onClick={() => setMode("compact")}
          >
            COMPACT
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "detail"}
            className={cn(s.segBtn, mode === "detail" && s.segBtnOn)}
            onClick={() => setMode("detail")}
          >
            DETAIL
          </button>
        </div>
        <div className={s.seg} role="tablist" aria-label="Language">
          <button
            type="button"
            role="tab"
            aria-selected={lang === "vi"}
            className={cn(s.segBtn, s.segBtnLang, lang === "vi" && s.segBtnOn)}
            onClick={() => onLang("vi")}
          >
            VI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={lang === "en"}
            className={cn(s.segBtn, s.segBtnLang, lang === "en" && s.segBtnOn)}
            onClick={() => onLang("en")}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}
