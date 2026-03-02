"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./skill-bars.module.scss";

type Skill = {
  title: string;
  description: string;
  tags?: Array<{ name: string }>;
};

export function SkillGrid({
  skills,
}: {
  skills: (Skill & { percent: number })[];
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const splitAt = Math.ceil(skills.length / 2);
  const cols = useMemo(() => [skills.slice(0, splitAt), skills.slice(splitAt)], [skills, splitAt]);

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
    <div ref={rootRef} className={styles.skillGrid}>
      {cols.map((col, colIdx) => (
        <div key={colIdx} className={styles.skillCol}>
          {col.map((skill, idx) => {
            const level = skill.tags?.[0]?.name ?? "";
            const percent = skill.percent;
            // Stagger delay for premium feel.
            const delayMs = (colIdx * splitAt + idx) * 60;
            return (
              <div key={`${skill.title}-${colIdx}-${idx}`} className={styles.skillRowNew}>
                <div className={styles.skillNameBlock}>
                  <div className={styles.skillTitle}>{skill.title}</div>
                  <div className={styles.skillLevel}>{level || ""}</div>
                </div>

                <div className={styles.skillBarBlock}>
                  <div className={styles.skillBarHeader}>Proficiency</div>
                  <div className={styles.bar}>
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

                <div className={styles.skillPercent}>{percent}%</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
