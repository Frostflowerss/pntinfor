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

function classShort(value: string) {
  const parts = value.split(":");
  const last = (parts[parts.length - 1] ?? value).trim();
  return last || value;
}

function ClassBadge({ value }: { value: string }) {
  const short = classShort(value);
  return (
    <div className={styles.classBadge} aria-label={`Construction Class ${short}`}>
      <span className={styles.classBadgeLabel}>Construction Class:</span>
      <span className={styles.classBadgeValue}>{short}</span>
      <span className={styles.shimmer} aria-hidden="true" />
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
          <div className={styles.modalHeaderLeft}>
            <Heading as="h2" variant="heading-strong-l" wrap="balance">
              <BilingualBlock vi={project.titleVI} en={project.titleEN} />
            </Heading>
          </div>

          <div className={styles.modalHeaderRight}>
            <ClassBadge value={project.constructionClassEN} />
            <button className={styles.closeIconBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
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

  const n = workProjects.length;
  const hasLoop = n > 1;

  // Clone edges for seamless looping: [last, ...real, first]
  const projects = useMemo(() => {
    if (!hasLoop) return workProjects;
    return [workProjects[n - 1], ...workProjects, workProjects[0]];
  }, [hasLoop, n]);

  // Virtual index (includes clones). Start at 1 (first real item).
  const [activeV, setActiveV] = useState(hasLoop ? 1 : 0);
  const [openId, setOpenId] = useState<string | null>(null);

  const toRealIndex = (vIdx: number) => {
    if (!hasLoop) return vIdx;
    if (vIdx === 0) return n - 1;
    if (vIdx === n + 1) return 0;
    return vIdx - 1;
  };

  const activeIndex = toRealIndex(activeV);
  const activeProject = workProjects[activeIndex];

  const openProject = useMemo(
    () => workProjects.find((p) => p.id === openId) ?? null,
    [openId],
  );

  const scrollToVirtual = (vIdx: number, behavior: ScrollBehavior = "smooth") => {
    const el = itemRefs.current[vIdx];
    if (!el) return;
    el.scrollIntoView({ behavior, inline: "center", block: "nearest" });
  };

  // Keep activeV synced with what's centered.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible.length === 0) return;

        const v = Number((visible[0].target as HTMLElement).dataset.vindex ?? "0");
        if (!Number.isNaN(v)) setActiveV(v);
      },
      {
        root,
        threshold: [0.55, 0.65, 0.75],
      },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Seamless loop jump when landing on clones.
  useEffect(() => {
    if (!hasLoop) return;
    if (activeV === 0) {
      // Jump to last real item (virtual n)
      requestAnimationFrame(() => scrollToVirtual(n, "auto"));
      setActiveV(n);
    } else if (activeV === n + 1) {
      // Jump to first real item (virtual 1)
      requestAnimationFrame(() => scrollToVirtual(1, "auto"));
      setActiveV(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeV, hasLoop, n]);

  const prev = () => {
    if (!hasLoop) return;
    scrollToVirtual(activeV - 1);
  };

  const next = () => {
    if (!hasLoop) return;
    scrollToVirtual(activeV + 1);
  };

  return (
    <Column fillWidth gap="m" paddingTop="l">
      <Row fillWidth paddingX="l" paddingBottom="s" horizontal="between" vertical="end" wrap>
        <Heading as="h1" variant="heading-strong-xl" align="left" wrap="balance">
          <span className="pnt-vi">Dự án</span>
          <br />
          <span className="pnt-en">Projects</span>
        </Heading>
        {activeProject ? <ClassBadge value={activeProject.constructionClassEN} /> : null}
      </Row>

      <div className={styles.carouselWrap}>
        <button className={styles.navBtn} onClick={prev} aria-label="Previous project" type="button">
          ‹
        </button>

        <div ref={scrollerRef} className={styles.scroller} aria-label="Projects carousel">
          {projects.map((p, vIdx) => {
            const isActive = vIdx === activeV;
            const isNeighbor = Math.abs(vIdx - activeV) === 1;

            return (
              <div
                key={`${p.id}-${vIdx}`}
                className={`${styles.slide} ${isActive ? styles.slideActive : ""} ${
                  isNeighbor ? styles.slideNeighbor : ""
                }`}
                data-vindex={vIdx}
                ref={(el) => {
                  itemRefs.current[vIdx] = el;
                }}
              >
                <button
                  className={styles.cardButton}
                  onClick={() => setOpenId(p.id)}
                  aria-label={`${p.titleEN}`}
                  type="button"
                >
                  <div className={styles.cover}>
                    <img src={p.cover} alt={p.titleEN} loading={vIdx < 3 ? "eager" : "lazy"} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <button className={styles.navBtn} onClick={next} aria-label="Next project" type="button">
          ›
        </button>
      </div>

      <div className={styles.progressWrap} aria-label="Project progress">
        {workProjects.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.segment} ${idx === activeIndex ? styles.segmentActive : ""}`}
            onClick={() => scrollToVirtual(hasLoop ? idx + 1 : idx)}
            aria-label={`Go to project ${idx + 1}`}
            type="button"
          >
            <span className={styles.segmentGlow} aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Fixed meta panel (text stays, only fades per active slide) */}
      {activeProject && (
        <div key={activeProject.id} className={styles.metaPanel}>
          <div className={styles.metaLeft}>
            <BilingualBlock vi={activeProject.titleVI} en={activeProject.titleEN} />
            {/* Removed construction class line under summary (per request) */}
            <div className={styles.location}>
              <BilingualBlock vi={activeProject.locationVI} en={activeProject.locationEN} mutedEN />
            </div>
          </div>

          <div className={styles.metaRight}>
            <Text variant="heading-strong-s">
              <BilingualBlock vi="Vai trò chính" en="Primary role" />
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              <BilingualBlock vi={activeProject.primaryRoleVI} en={activeProject.primaryRoleEN} />
            </Text>
          </div>
        </div>
      )}

      {openProject && <ProjectModal project={openProject} onClose={() => setOpenId(null)} />}
    </Column>
  );
}
