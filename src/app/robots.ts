import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Không liệt kê /pntarch ở đây nữa: robots.txt là file công khai, ghi
    // disallow vào chẳng khác nào dựng biển chỉ đường tới trang quản trị. Panel
    // đã tự đặt noindex qua metadata (pntarch/layout.tsx) nên vẫn không bị index.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
