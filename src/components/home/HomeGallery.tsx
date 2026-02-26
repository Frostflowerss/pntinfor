"use client";

import { Carousel, Column } from "@once-ui-system/core";

type HomeGalleryProps = {
  images: { src: string; alt: string }[];
};

export function HomeGallery({ images }: HomeGalleryProps) {
  return (
    <Column fillWidth>
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((img) => ({ slide: img.src, alt: img.alt }))}
      />
    </Column>
  );
}
