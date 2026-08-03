"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import type { GalleryImage } from "@/lib/types";

export function GalleryView({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = images.map((g) => ({ url: g.url, alt: g.alt || "Gallery image" }));

  if (images.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--line)] py-24 text-center">
        <p className="vi text-lg">Chưa có ảnh trong thư viện.</p>
        <p lang="en" className="en text-sm">No images yet.</p>
      </div>
    );
  }

  return (
    <>
      <Stagger className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((g, i) => (
          <StaggerItem key={g.id}>
            <button
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden rounded-xl border border-[var(--line)]"
              aria-label={`Phóng to ảnh ${i + 1}`}
            >
              {/* Kích thước thật nếu có. Trước đây chỉ chia làm hai rổ
                  dọc/ngang (800x1100 hoặc 800x560) rồi object-cover — mọi ảnh
                  không rơi đúng hai tỉ lệ đó đều bị xén. */}
              <SmartImage
                src={g.url}
                alt={g.alt || `Ảnh thư viện ${i + 1}`}
                width={g.width ?? 800}
                height={g.height ?? (g.orientation === "vertical" ? 1100 : 560)}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                wrapperClassName="w-full"
              />
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </>
  );
}
