"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./skill-bars.module.scss";

type Skill = {
  title: string;
  description: string;
  tags?: Array<{ name: string }>;
};

type SkillItem = Skill & { percent: number; column?: 1 | 2 };

export function SkillGrid({ skills }: { skills: SkillItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const cols = useMemo(() => {
    const hasExplicit = skills.some((s) => s.column === 1 || s.column === 2);
    if (hasExplicit) {
      const col1 = skills.filter((s) => s.column === 1);
      const col2 = skills.filter((s) => s.column === 2);
      const rest = skills.filter((s) => !s.column);
      // Distribute the rest to keep columns balanced.
      rest.forEach((s) => {
        if (col1.length <= col2.length) col1.push(s);
        else col2.push(s);
      });
      return [col1, col2];
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
            const level = (skill.tags?.[0]?.name ?? "").toString();
            const percent = skill.percent;
            const delayMs = (colIdx * 10 + idx) * 70;

            return (
              <div key={`${skill.title}-${colIdx}-${idx}`} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <div className={styles.skillTitle} title={skill.title}>
                    {skill.title}
                  </div>

                  <div className={styles.levelBadge} aria-label={`Skill level ${level}`}>
                    <span className={styles.levelText}>{level}</span>
                    <span className={styles.levelShimmer} aria-hidden="true" />
                  </div>
                </div>

                <div className={styles.bar} aria-label={`${skill.title} level ${level}`}>
                  <div
                    className={`${styles.fill} ${active ? styles.fillActive : ""}`}
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      "--target": `${percent}%`,
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
