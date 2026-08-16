import type { Metadata } from "next";
import "./globals.css";
import { getSiteData } from "@/lib/data";

import { fontDisplay, fontMono, fontSans } from "./fonts";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const title = `${profile.name} — ${profile.role}`;
  return {
    title: { default: title, template: `%s — ${profile.name}` },
    description: profile.summaryEN || `Portfolio of ${profile.name}, ${profile.role}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: { title, description: profile.summaryEN, type: "website" },
    robots: { index: true, follow: true },
  };
}

/* Runs before paint so the theme never flashes. Kept tiny and dependency-free. */
// Runs before paint: sets theme (no flash) and, on the CV page, the compact/detail
// mode so the site chrome is hidden immediately when Compact is the default.
const themeScript = `(function(){try{var t=localStorage.getItem('pnt-theme')||'dark';document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}try{var p=location.pathname.replace(/\\/$/,'');if(p==='/about'){var v=new URLSearchParams(location.search).get('view');document.documentElement.setAttribute('data-cv',v==='detail'?'detail':'compact');}}catch(e){}})();`;

/** Only hex / rgb(a) / hsl(a) colours reach the stylesheet. */
const COLOR_RE = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d.%,\s/]+\))$/i;
function safeColor(v: string, fallback: string) {
  const clean = (v || "").trim();
  return COLOR_RE.test(clean) ? clean : fallback;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getSiteData();
  const accent = safeColor(profile.accent, "#5c8cff");
  const en = safeColor(profile.enColor || profile.accent, "#7ea2ff");
  const colorVars = `:root{--accent:${accent};--en:${en};}`;

  return (
    <html
      lang={profile.defaultLang}
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
