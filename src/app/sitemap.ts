import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getSiteData();

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Cố tình KHÔNG đóng dấu lastModified: new Date(). Bản cũ làm vậy nên mỗi lần
  // crawl là cả site báo "vừa đổi", khiến tín hiệu này thành vô nghĩa với Google.
  // Bảng dữ liệu chưa có cột updated_at; khi nào có thì map vào đây.
  const work: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...routes, ...work];
}
