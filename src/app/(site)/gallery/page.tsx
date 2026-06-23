import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { GalleryView } from "@/components/gallery/GalleryView";
import { Reveal } from "@/components/ui/motion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery.",
};

export default async function GalleryPage() {
  const { gallery } = await getSiteData();

  return (
    <div className="shell pb-10">
      <Reveal>
        <header className="mb-14 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            Gallery — {String(gallery.length).padStart(2, "0")}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-tight">
            <span className="vi">Thư viện</span> <span className="en">Gallery</span>
          </h1>
        </header>
      </Reveal>
      <GalleryView images={gallery} />
    </div>
  );
}
