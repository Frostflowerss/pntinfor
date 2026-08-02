import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteData } from "@/lib/data";
import { darkenToContrast } from "@/lib/color";
import { SITE_URL } from "@/lib/site";

/**
 * Font tự host qua next/font thay vì <link> tới fonts.googleapis.com.
 * Bản cũ chặn render bằng một request tới host thứ ba (thêm RTT + FOUT), và
 * gửi IP của mọi khách truy cập sang Google. next/font nhúng font vào cùng
 * origin, tự sinh @font-face và tự chèn fallback khớp metric để giảm CLS.
 */
const display = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0e" },
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const title = `${profile.name} — ${profile.role}`;
  const description = profile.summaryEN || `Portfolio of ${profile.name}, ${profile.role}.`;
  return {
    title: { default: title, template: `%s — ${profile.name}` },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      siteName: profile.name,
      locale: "vi_VN",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

const themeScript = `(function(){try{var t=localStorage.getItem('pnt-theme')||'dark';document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

// Allow only safe CSS color characters to avoid injection.
function safeColor(v: string, fallback: string) {
  const clean = (v || "").trim();
  return /^[#a-zA-Z0-9(),.%\s-]{0,60}$/.test(clean) && clean ? clean : fallback;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getSiteData();
  const accent = safeColor(profile.accent, "#5c8cff");
  const en = safeColor(profile.enColor || profile.accent, "#7ea2ff");

  // Ở theme sáng, accent/EN nguyên bản chỉ đạt ~2,2:1 trên nền giấy #f4f3ef —
  // toàn bộ chữ tiếng Anh và dòng chức danh không đọc được. Tối màu vừa đủ để
  // chạm ngưỡng AA 4,5:1 mà vẫn giữ đúng tông thương hiệu người dùng đã chọn.
  const accentLight = darkenToContrast(accent);
  const enLight = darkenToContrast(en);
  const colorVars =
    `:root{--accent:${accent};--en:${en};}` +
    `:root[data-theme="light"]{--accent:${accentLight};--en:${enLight};}`;

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
