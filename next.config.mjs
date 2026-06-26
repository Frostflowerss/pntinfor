/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    }
  } catch {}
  return undefined;
})();

const remotePatterns = [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }];
if (supabaseHost && !supabaseHost.endsWith(".supabase.co")) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" });
}

const nextConfig = {
  images: { remotePatterns, formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};
export default nextConfig;
