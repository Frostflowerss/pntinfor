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
        <p className="en text-sm">No images yet — upload them in the studio.</p>
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
              aria-label={`Open image ${i + 1}`}
            >
              <SmartImage
                src={g.url}
                alt={g.alt || "Gallery image"}
                width={800}
                height={g.orientation === "vertical" ? 1100 : 560}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
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
