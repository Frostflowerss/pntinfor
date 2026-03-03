"use client";

import React from "react";
import { Column, Flex, Text } from "@once-ui-system/core";
import styles from "./about.module.scss";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

function splitBilingual(label: string): { vi: string; en: string } {
  const parts = label.split("/").map((p) => p.trim());
  if (parts.length >= 2) return { vi: parts[0], en: parts.slice(1).join(" / ") };
  return { vi: label, en: "" };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!about.tableOfContent.display) return null;

  return (
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      m={{ hide: true }}
    >
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => {
          const { vi, en } = splitBilingual(section.title);
          return (
            <Column key={sectionIndex} gap="12">
              <Flex
                cursor="interactive"
                className={styles.hover}
                gap="8"
                vertical="center"
                onClick={() => scrollTo(section.title, 88)}
              >
                <Flex height="1" minWidth="16" background="neutral-strong" />
                <Text>
                  <span className="pnt-vi">{vi}</span>
                  {en ? (
                    <>
                      <br />
                      <span className="pnt-en">{en}</span>
                    </>
                  ) : null}
                </Text>
              </Flex>

              {about.tableOfContent.subItems && (
                <>
                  {section.items.map((item, itemIndex) => (
                    <Flex
                      l={{ hide: true }}
                      key={itemIndex}
                      style={{ cursor: "pointer" }}
                      className={styles.hover}
                      gap="12"
                      paddingLeft="24"
                      vertical="center"
                      onClick={() => scrollTo(item, 88)}
                    >
                      <Flex height="1" minWidth="8" background="neutral-strong" />
                      <Text>{item}</Text>
                    </Flex>
                  ))}
                </>
              )}
            </Column>
          );
        })}
    </Column>
  );
};

export default TableOfContents;
