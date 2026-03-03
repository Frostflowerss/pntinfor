"use client";

import React from "react";
import { Row, Text } from "@once-ui-system/core";
import styles from "./mobile-toc.module.scss";

type Section = {
  title: string;
  display: boolean;
  items: string[];
};

function splitBilingual(label: string): { vi: string; en: string } {
  const parts = label.split("/").map((p) => p.trim());
  if (parts.length >= 2) return { vi: parts[0], en: parts.slice(1).join(" / ") };
  return { vi: label, en: "" };
}

export default function MobileTOC({ structure }: { structure: Section[] }) {
  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.scroller}>
        {structure
          .filter((s) => s.display)
          .map((s) => {
            const { vi, en } = splitBilingual(s.title);
            return (
              <button
                key={s.title}
                className={styles.chip}
                onClick={() => scrollTo(s.title, 88)}
                type="button"
              >
                <Row gap="8" vertical="center">
                  <Text variant="label-default-s">
                    <span className="pnt-vi">{vi}</span>
                    {en ? (
                      <>
                        <br />
                        <span className="pnt-en">{en}</span>
                      </>
                    ) : null}
                  </Text>
                </Row>
              </button>
            );
          })}
      </div>
    </div>
  );
}
