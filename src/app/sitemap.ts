import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { projects } = await getSiteData();
  const now = new Date();
  const routes = ["", "/about", "/work", "/gallery"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
  }));
  const work = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
  }));
  return [...routes, ...work];
}
