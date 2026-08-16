"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { CvMode } from "@/lib/types";

type Ctx = { mode: CvMode; setMode: (m: CvMode) => void; onCvPage: boolean };

const CvViewContext = createContext<Ctx>({ mode: "compact", setMode: () => {}, onCvPage: false });

export const useCvView = () => useContext(CvViewContext);

const CV_PATH = "/about";

/**
 * Holds the CV view mode (compact vs detail) so both the site header (switch pill)
 * and the CV page consume one source of truth.
 *
 * - Default is always COMPACT on a fresh visit to /about.
 * - `?view=detail` opens Detail directly (shareable link).
 * - Sets `data-cv` on <html> so globals.css can hide the site chrome in compact
 *   (the pre-paint script in RootLayout sets it first to avoid any flash).
 * - Clears itself when navigating away from /about so other pages are untouched.
 */
export function CvViewProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const onCvPage = pathname === CV_PATH;
  const [mode, setModeState] = useState<CvMode>("compact");

  useEffect(() => {
    if (!onCvPage) {
      document.documentElement.removeAttribute("data-cv");
      setModeState("compact");
      return;
    }
    const view = new URLSearchParams(window.location.search).get("view");
    const next: CvMode = view === "detail" ? "detail" : "compact";
    setModeState(next);
    document.documentElement.setAttribute("data-cv", next);
  }, [pathname, onCvPage]);

  const setMode = useCallback(
    (m: CvMode) => {
      setModeState(m);
      if (!onCvPage) return;
      document.documentElement.setAttribute("data-cv", m);
      const params = new URLSearchParams(window.location.search);
      if (m === "detail") params.set("view", "detail");
      else params.delete("view");
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    },
    [onCvPage]
  );

  return <CvViewContext.Provider value={{ mode, setMode, onCvPage }}>{children}</CvViewContext.Provider>;
}
