"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export type GalleryEntry = { url: string; width: number | null; height: number | null };

/** Tỉ lệ dùng cho ảnh cũ chưa có kích thước trong DB. */
const FALLBACK = { width: 900, height: 650 };

export function ProjectGallery({
  images,
  title,
}: {
  images: GalleryEntry[];
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = images.map((img, i) => ({
    url: img.url,
    alt: `${title} — ảnh ${i + 1}`,
  }));

  if (images.length === 0) return null;

  return (
    <>
      <Stagger className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
        {images.map((img, i) => {
          // Trước đây MỌI ảnh bị ép width=900 height=650 rồi object-cover, nên
          // bản vẽ dọc và ảnh panorama đều bị xén về 1,38:1. Dùng kích thước
          // thật thì mỗi ảnh giữ đúng tỉ lệ gốc, và trình duyệt cũng biết trước
          // chiều cao nên không giật layout lúc ảnh tải xong.
          const w = img.width ?? FALLBACK.width;
          const h = img.height ?? FALLBACK.height;
          return (
            <StaggerItem key={img.url + i}>
              <button
                onClick={() => setIndex(i)}
                className="group block w-full overflow-hidden rounded-xl border border-[var(--line)]"
                aria-label={`Phóng to ảnh ${i + 1} của ${title}`}
              >
                <SmartImage
                  src={img.url}
                  alt={`${title} — ảnh ${i + 1}`}
                  width={w}
                  height={h}
                  sizes="(max-width:640px) 100vw, 50vw"
                  className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  wrapperClassName="w-full"
                />
              </button>
            </StaggerItem>
          );
        })}
      </Stagger>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </>
  );
}
