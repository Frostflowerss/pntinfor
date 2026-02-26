
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Column, Media, Row } from "@once-ui-system/core";
import { gallery } from "@/resources";

function useActiveIndex(containerRef: React.RefObject<HTMLDivElement>, count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || count <= 0) return;

    const children = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.index ?? "0");
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { root: el, threshold: [0.5, 0.65, 0.8] },
    );

    children.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [containerRef, count]);

  return active;
}

export default function Home() {
  const images = useMemo(() => gallery.images.slice(0, 10), []);
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveIndex(ref, images.length);

  return (
    <Column maxWidth="l" paddingY="12" className="sectionPad" gap="m">
      <Row
        ref={ref as any}
        fillWidth
        gap="12"
        style={{
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "8px",
        }}
      >
        {images.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            data-slide
            data-index={i}
            style={{
              flex: "0 0 auto",
              width: "min(78vw, 520px)",
              height: "min(70vh, 540px)",
              scrollSnapAlign: "center",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid var(--neutral-border-weak)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <Media
              enlarge
              radius="none"
              sizes="(max-width: 960px) 80vw, 520px"
              alt={img.alt || "image"}
              src={img.src}
            />
          </div>
        ))}
      </Row>

      <Row horizontal="center" gap="8" paddingTop="12">
        {images.map((_, i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: i === active ? "var(--brand-strong)" : "rgba(255,255,255,0.18)",
              transition: "background 180ms ease",
            }}
          />
        ))}
      </Row>
    </Column>
  );
}
