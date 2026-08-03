/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    }
  } catch {}
  return undefined;
})();

/**
 * Chỉ cho phép đúng host Supabase của dự án.
 * Trước đây dùng wildcard "**.supabase.co", khớp MỌI tenant Supabase trên đời —
 * biến /_next/image thành proxy ảnh miễn phí cho nội dung của người khác, phục
 * vụ từ chính domain này. File đã tự tính đúng host sẵn, giờ mới thực sự dùng.
 */
const remotePatterns = supabaseHost
  ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
  : [];

if (!supabaseHost) {
  console.warn(
    "[next.config] NEXT_PUBLIC_SUPABASE_URL không có lúc build — remotePatterns rỗng, " +
      "next/image sẽ CHẶN mọi ảnh Supabase. Trên Vercel, nhớ gắn biến này cho cả " +
      "Preview nếu muốn bản preview hiển thị ảnh thật."
  );
}

/**
 * CSP: script-src cần 'unsafe-inline' vì layout nhúng inline script đặt theme
 * (chạy trước paint để tránh nháy màu) và inline style biến màu. Nới đúng chỗ
 * đó thay vì bỏ hẳn CSP.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseHost ? `https://${supabaseHost}` : ""}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseHost ? `https://${supabaseHost}` : ""}`.trim(),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  images: { remotePatterns, formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;
