"use client";

import { useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = images.map((url, i) => ({ url, alt: `${title} — ${i + 1}` }));

  if (images.length === 0) return null;

  return (
    <>
      <Stagger className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
        {images.map((url, i) => (
          <StaggerItem key={i}>
            <button
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden rounded-xl border border-[var(--line)]"
              aria-label={`Open image ${i + 1}`}
            >
              <SmartImage
                src={url}
                alt={`${title} — ${i + 1}`}
                width={900}
                height={650}
                sizes="(max-width:640px) 100vw, 50vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
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
