"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./skill-bars.module.scss";

export type SkillItem = {
  title: string;
  level: string;   // e.g. Expert/Experienced/Skillful/Beginner
  percent: number; // 0..100
  column?: 1 | 2;  // optional manual placement
};

export function SkillGrid({ skills }: { skills: SkillItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const cols = useMemo(() => {
    const hasManual = skills.some((s) => s.column === 1 || s.column === 2);
    if (hasManual) {
      return [
        skills.filter((s) => (s.column ?? 1) === 1),
        skills.filter((s) => (s.column ?? 1) === 2),
      ];
    }
    const splitAt = Math.ceil(skills.length / 2);
    return [skills.slice(0, splitAt), skills.slice(splitAt)];
  }, [skills]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.skillGridNew}>
      {cols.map((col, colIdx) => (
        <div key={colIdx} className={styles.skillColNew}>
          {col.map((skill, idx) => {
            // Stagger delay for premium feel.
            const delayMs = (colIdx * 10 + idx) * 60;

            return (
              <div key={`${skill.title}-${colIdx}-${idx}`} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <div className={styles.skillTitle}>{skill.title}</div>

                  <div className={styles.levelBadge} aria-label={`Skill level ${skill.level}`}>
                    <span className={styles.levelText}>{skill.level}</span>
                    <span className={styles.levelShimmer} aria-hidden="true" />
                  </div>
                </div>

                <div className={styles.bar} aria-label={`${skill.title} skill bar`}>
                  <div
                    className={`${styles.fill} ${active ? styles.fillActive : ""}`}
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      "--target": `${skill.percent}%`,
                      transitionDelay: `${delayMs}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
