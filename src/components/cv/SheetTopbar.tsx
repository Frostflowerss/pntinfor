"use client";

import { cn } from "@/lib/utils";
import type { CvMode, Lang } from "@/lib/types";
import s from "./ScheduleSheet.module.css";

export function SheetTopbar({
  sheetId,
  revision,
  mode,
  lang,
  onMode,
  onLang,
  suffix = "SCHEDULE SHEET",
}: {
  sheetId: string;
  revision: string;
  mode: CvMode;
  lang: Lang;
  onMode: (m: CvMode) => void;
  onLang: (l: Lang) => void;
  suffix?: string;
}) {
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
            onClick={() => onMode("compact")}
          >
            COMPACT
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "detail"}
            className={cn(s.segBtn, mode === "detail" && s.segBtnOn)}
            onClick={() => onMode("detail")}
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
