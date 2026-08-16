"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/types";
import s from "./ScheduleSheet.module.css";

/** Detail = the original website. Its home lives at /home (the CV owns the root URL). */
export const DETAIL_HREF = "/home";

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
        <div className={s.seg} role="group" aria-label="View">
          <span className={cn(s.segBtn, s.segBtnOn)} aria-current="page">
            COMPACT
          </span>
          <Link href={DETAIL_HREF} className={s.segBtn} prefetch>
            DETAIL
          </Link>
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
