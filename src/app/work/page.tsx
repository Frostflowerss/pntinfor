
"use client";

import React, { useMemo, useState } from "react";
import { Column, Heading, Schema, Text } from "@once-ui-system/core";
import { baseURL, work, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import styles from "@/components/work/Projects.module.scss";

type ProjectMeta = {
  title: string;
  summary?: string;
  images: string[];
  constructionClass?: string;
  location?: string;
  rolePrimary?: string;
  summaryVi?: string;
  summaryEn?: string;
};

export default function Work() {
  const posts = useMemo(() => getPosts(["src", "app", "work", "projects"]), []);
  const sorted = useMemo(
    () =>
      posts.sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()),
    [posts],
  );

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = sorted[active];

  return (
    <Column maxWidth="l" paddingY="12" className="sectionPad" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{ name: person.name, url: `${baseURL}${work.path}`, image: `${baseURL}${person.avatar}` }}
      />

      <Heading as="h1" variant="display-strong-s" className="headlineFix">
        {work.label}
      </Heading>

      <div className={styles.projectRail} onScroll={(e) => {
        const el = e.currentTarget;
        const children = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        children.forEach((c, i) => {
          const rect = c.getBoundingClientRect();
          const left = c.offsetLeft;
          const mid = left + c.clientWidth / 2;
          const d = Math.abs(mid - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActive(best);
      }}>
        {sorted.map((p, idx) => {
          const meta = p.metadata as ProjectMeta;
          const cover = meta.images?.[0];
          const isActive = idx === active;
          return (
            <button
              key={p.slug}
              type="button"
              data-card
              className={styles.projectCard}
              onClick={() => { setActive(idx); setOpen(true); }}
              aria-label={meta.title}
            >
              <img src={cover} alt={meta.title} className={styles.projectImage} />
              <div className={styles.overlay}>
                <div className={styles.leftBox} style={{ opacity: isActive ? 1 : 0.85 }}>
                  <div className={styles.title}>{meta.title}</div>
                  <div className={styles.meta}>
                    {(meta.constructionClass || "").trim() ? `Class ${meta.constructionClass}` : ""}
                    {(meta.location || "").trim() ? ` • ${meta.location}` : ""}
                  </div>
                </div>
                <div className={styles.rightBox} style={{ opacity: isActive ? 1 : 0.85 }}>
                  <div className={styles.role}>{meta.rolePrimary || meta.summary || ""}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {open && current && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>

            <div className={styles.modalGallery}>
              {(current.metadata as ProjectMeta).images?.slice(0, 5).map((src, i) => (
                <div key={i} className={styles.modalImgWrap}>
                  <img src={src} alt={(current.metadata as ProjectMeta).title} />
                </div>
              ))}
            </div>

            <Column gap="m" paddingTop="16">
              <Heading as="h2" variant="heading-strong-l">{(current.metadata as ProjectMeta).title}</Heading>

              {(current.metadata as ProjectMeta).summaryVi && (
                <Text className="viText" variant="body-default-m">{(current.metadata as ProjectMeta).summaryVi}</Text>
              )}
              {(current.metadata as ProjectMeta).summaryEn && (
                <Text className="enText" variant="body-default-m">{(current.metadata as ProjectMeta).summaryEn}</Text>
              )}

              <div style={{ height: 1, background: "rgba(255,255,255,0.14)", marginTop: 8, marginBottom: 8 }} />

              <div className={styles.modalContent}>
                {/* Render MDX content as plain text fallback */}
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {String(current.content || "").replace(/\n+/g, "\n")}
                </Text>
              </div>
            </Column>
          </div>
        </div>
      )}
    </Column>
  );
}
