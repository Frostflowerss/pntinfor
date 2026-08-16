/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    }
  } catch {}
  return undefined;
})();

const remotePatterns = [
  { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
];
if (supabaseHost && !supabaseHost.endsWith(".supabase.co")) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" });
}

/**
 * Content-Security-Policy.
 * Scripts: 'unsafe-inline' is required by the tiny pre-paint theme script; upgrade to nonces
 * (middleware) if you ever embed third-party scripts. Everything else is locked to self + Supabase.
 */
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "https://*.supabase.co";
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: https://*.supabase.co ${supabaseOrigin}`,
  `connect-src 'self' https://*.supabase.co ${supabaseOrigin}`,
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Studio + API are never indexed or cached by intermediaries.
      {
        source: "/pntarch/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};
export default nextConfig;
