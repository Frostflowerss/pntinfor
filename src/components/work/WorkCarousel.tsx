"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Carousel, Column, Heading, Row, Text } from "@once-ui-system/core";
import styles from "./WorkCarousel.module.scss";
import { workProjects, WorkProject } from "@/resources/portfolio-data";

function BilingualBlock({ vi, en, mutedEN }: { vi: string; en: string; mutedEN?: boolean }) {
  return (
    <div className="pnt-bilingual">
      <span className="pnt-vi">{vi}</span>
      <span className={mutedEN ? "pnt-en pnt-muted" : "pnt-en"}>{en}</span>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: WorkProject; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose} role="presentation">
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div>
            <Heading as="h2" variant="heading-strong-l" wrap="balance">
              <BilingualBlock vi={project.titleVI} en={project.titleEN} />
            </Heading>
            <Row paddingTop="8" gap="12" wrap>
              <div className={styles.tag}>
                <BilingualBlock vi={project.constructionClassVI} en={project.constructionClassEN} mutedEN />
              </div>
            </Row>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <span className="pnt-vi">Đóng</span>
            <span className="pnt-en" style={{ marginLeft: 8 }}>
              Close
            </span>
          </button>
        </div>

        <div className={styles.modalBody}>
          <Carousel
            sizes="(max-width: 960px) 100vw, 960px"
            items={project.images.map((src, idx) => ({
              slide: src,
              alt: `${project.titleEN} – ${idx + 1}`,
            }))}
          />

          <div className={styles.section}>
            <Heading as="h3" variant="heading-strong-m">
              <BilingualBlock vi="Tổng quan" en="Overview" />
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              <BilingualBlock vi={project.details.overviewVI} en={project.details.overviewEN} />
            </Text>
          </div>

          <div className={styles.section}>
            <Heading as="h3" variant="heading-strong-m">
              <BilingualBlock vi="Nhiệm vụ chính" en="Key responsibilities" />
            </Heading>
            <div className={styles.list}>
              {project.details.responsibilitiesVI.map((vi, idx) => (
                <div key={idx}>
                  <BilingualBlock vi={vi} en={project.details.responsibilitiesEN[idx] ?? ""} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const openProject = useMemo(
    () => workProjects.find((p) => p.id === openId) ?? null,
    [openId],
  );

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible.length === 0) return;

        const idx = Number((visible[0].target as HTMLElement).dataset.index ?? "0");
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      {
        root,
        threshold: [0.55, 0.65, 0.75],
      },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <Column fillWidth gap="m" paddingTop="24">
      <Row fillWidth paddingX="l" paddingBottom="8">
        <Heading as="h1" variant="heading-strong-xl" align="center" wrap="balance">
          <span className="pnt-vi">Dự án</span>
          <br />
          <span className="pnt-en">Projects</span>
        </Heading>
      </Row>

      <div ref={scrollerRef} className={styles.scroller} aria-label="Projects carousel">
        {workProjects.map((p, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={p.id}
              className={styles.slide}
              data-index={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
            >
              <button
                className={styles.cardButton}
                onClick={() => setOpenId(p.id)}
                aria-label={`${p.titleEN}`}
              >
                <div className={styles.cover}>
                  <img src={p.cover} alt={p.titleEN} loading={idx < 2 ? "eager" : "lazy"} />
                </div>

                <div
                  className={`${styles.meta} ${isActive ? styles.metaActive : styles.metaInactive}`}
                >
                  <div className={styles.left}>
                    <BilingualBlock vi={p.titleVI} en={p.titleEN} />
                    <div className={styles.tag}>
                      <BilingualBlock vi={p.constructionClassVI} en={p.constructionClassEN} mutedEN />
                    </div>
                    <div className={styles.location}>
                      <BilingualBlock vi={p.locationVI} en={p.locationEN} mutedEN />
                    </div>
                  </div>

                  <div className={styles.right}>
                    <Text variant="heading-strong-s">
                      <BilingualBlock vi="Vai trò chính" en="Primary role" />
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      <BilingualBlock vi={p.primaryRoleVI} en={p.primaryRoleEN} />
                    </Text>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.dots} aria-label="Project indicators">
        {workProjects.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenId(null)} />}
    </Column>
  );
}
