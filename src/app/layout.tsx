import type { Metadata } from "next";
import "./globals.css";
import { getSiteData } from "@/lib/data";

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

const themeScript = `(function(){try{var t=localStorage.getItem('pnt-theme')||'dark';document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
