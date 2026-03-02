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
  // Expected formats: "Construction Class: II" or "Cấp công trình: II".
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

  const [activeVirtualIndex, setActiveVirtualIndex] = useState(1); // 0..n+1 (includes clones)
  const [openId, setOpenId] = useState<string | null>(null);

  const projects = useMemo(() => {
    const n = workProjects.length;
    if (n === 0) return [];
    return [workProjects[n - 1], ...workProjects, workProjects[0]];
  }, []);

  const realCount = workProjects.length;
  const activeIndex = realCount > 0 ? (activeVirtualIndex - 1 + realCount) % realCount : 0;


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

        const vIdx = Number((visible[0].target as HTMLElement).dataset.vindex ?? "1");
        if (!Number.isNaN(vIdx)) setActiveVirtualIndex(vIdx);
      },
      {
        root,
        threshold: [0.55, 0.65, 0.75],
      },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  // Ensure we start on the first real slide (vIdx=1)
  useEffect(() => {
    const n = workProjects.length;
    if (n === 0) return;
    // Wait for refs to be set
    requestAnimationFrame(() => {
      scrollToVirtual(1, "auto");
      setActiveVirtualIndex(1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  }, []);

  const scrollToVirtual = (vIdx: number, behavior: ScrollBehavior = "smooth") => {
    const el = itemRefs.current[vIdx];
    if (!el) return;
    el.scrollIntoView({ behavior, inline: "center", block: "nearest" });
  };

  // Seamless loop: when reaching clone edges, jump to the corresponding real slide without animation.
  const jumpIfClone = (vIdx: number) => {
    const n = workProjects.length;
    if (n === 0) return;
    // clones: 0 is last-clone, n+1 is first-clone
    if (vIdx === 0) {
      // jump to real last (vIdx = n)
      requestAnimationFrame(() => scrollToVirtual(n, "auto"));
      setActiveVirtualIndex(n);
    } else if (vIdx === n + 1) {
      // jump to real first (vIdx = 1)
      requestAnimationFrame(() => scrollToVirtual(1, "auto"));
      setActiveVirtualIndex(1);
    }
  };


  const activeProject = workProjects[activeIndex];

  const prev = () => {
    const n = workProjects.length;
    if (n === 0) return;
    const nextV = activeVirtualIndex - 1;
    scrollToVirtual(nextV);
    setActiveVirtualIndex(nextV);
    // after smooth scroll, observer will update; but we also guard clones
    setTimeout(() => jumpIfClone(nextV), 420);
  };

  const next = () => {
    const n = workProjects.length;
    if (n === 0) return;
    const nextV = activeVirtualIndex + 1;
    scrollToVirtual(nextV);
    setActiveVirtualIndex(nextV);
    setTimeout(() => jumpIfClone(nextV), 420);
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
        <button
          className={styles.navBtn}
          onClick={prev}
          aria-label="Previous project"
          type="button"
        >
          ‹
        </button>

        <div ref={scrollerRef} className={styles.scroller} aria-label="Projects carousel">
        {projects.map((p, vIdx) => {
          const isActive = vIdx === activeVirtualIndex;
          const isNeighbor = Math.abs(vIdx - activeVirtualIndex) === 1;
          return (
            <div
              key={p.id}
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

        <button
          className={styles.navBtn}
          onClick={next}
          aria-label="Next project"
          type="button"
        >
          ›
        </button>
      </div>

      <div className={styles.progressWrap} aria-label="Project progress">
        {workProjects.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.segment} ${idx === activeIndex ? styles.segmentActive : ""}`}
            onClick={() => scrollToVirtual(idx + 1)}
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
            <div className={styles.location}>
              <BilingualBlock
                vi={activeProject.locationVI}
                en={activeProject.locationEN}
                mutedEN
              />
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
