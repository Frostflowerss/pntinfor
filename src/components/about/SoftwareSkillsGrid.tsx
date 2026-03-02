"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { RevealFx, Text } from "@once-ui-system/core";

type Skill = {
  title: string;
  description?: string;
  tags?: Array<{ name: string }>;
};

function levelToPercent(level: string) {
  switch (level) {
    case "Expert":
      return 92;
    case "Experienced":
      return 78;
    case "Skillful":
      return 68;
    case "Beginner":
      return 35;
    default:
      return 60;
  }
}

export default function SoftwareSkillsGrid({ skills }: { skills: Skill[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setInView(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = useMemo(() => {
    // Ensure 2 columns, 5 rows each when possible.
    const left = skills.slice(0, 5);
    const right = skills.slice(5, 10);
    return { left, right };
  }, [skills]);

  const renderCol = (col: Skill[], colIndex: number) => (
    <div className="pnt-skillCol">
      {col.map((skill, idx) => {
        const level = skill.tags?.[0]?.name ?? "";
        const percent = levelToPercent(level);
        const delay = 0.05 * (colIndex * 5 + idx);
        return (
          <RevealFx key={`${skill.title}-${idx}`} translateY={10} delay={delay}>
            <div className="pnt-skillRow" data-inview={inView ? "1" : "0"}>
              <div className="pnt-skillName">
                <Text variant="heading-strong-l">{skill.title}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {level || skill.description || ""}
                </Text>
              </div>

              <div className="pnt-skillBarWrap" aria-label={`${skill.title} proficiency ${percent}%`}>
                <div className="pnt-skillBar" />
                <div
                  className="pnt-skillFill"
                  style={{ ["--p" as any]: `${percent}%` }}
                />
              </div>

              <div className="pnt-skillPct">{percent}%</div>
            </div>
          </RevealFx>
        );
      })}
    </div>
  );

  return (
    <div ref={rootRef} className="pnt-skillGrid">
      {renderCol(items.left, 0)}
      {renderCol(items.right, 1)}
    </div>
  );
}
