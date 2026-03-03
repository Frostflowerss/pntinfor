// src/components/about/ProfileSidebar.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Column, Icon, Row, Text } from "@once-ui-system/core";
import styles from "@/components/about/ProfileSidebar.module.scss";
import { person } from "@/resources";
import { contact } from "@/resources/profile";

type Props = {
  languages?: string[];
  locationVI?: string;
  locationEN?: string;
  showTilt?: boolean; // default true (desktop)
};

export default function ProfileSidebar({
  languages = person.languages ?? [],
  locationVI = "Hà Nội",
  locationEN = "Ha Noi",
  showTilt = true,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const isCoarse = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (!showTilt || isCoarse) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1

      // clamp + subtle tilt
      const ry = (px - 0.5) * 8; // -4..4
      const rx = (0.5 - py) * 8; // -4..4
      setTilt({ rx, ry });
    };

    const onLeave = () => setTilt({ rx: 0, ry: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [showTilt, isCoarse]);

  return (
    <div className={styles.stickyWrap}>
      <div
        ref={cardRef}
        className={styles.card}
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 120ms ease",
        }}
      >
        <Column gap="m" horizontal="center">
          <Avatar src={person.avatar} size="xl" />

          <Row gap="s" vertical="center">
            <Icon onBackground="accent-weak" name="globe" />
            <span className="pnt-vi">{locationVI}</span>
            <span className="pnt-en" style={{ marginLeft: 8 }}>
              {locationEN}
            </span>
          </Row>

          {languages.length > 0 && (
            <Row gap="xs" wrap>
              {languages.map((lng, i) => (
                <Row
                  key={`${lng}-${i}`}
                  border="neutral-alpha-weak"
                  background="neutral-alpha-weak"
                  radius="full"
                  paddingX="s"
                  paddingY="xs"
                >
                  <Text variant="label-default-s">{lng}</Text>
                </Row>
              ))}
            </Row>
          )}

          {/* Contact (EN only, short) */}
          <Column
            fillWidth
            border="neutral-alpha-weak"
            background="neutral-alpha-weak"
            radius="l"
            padding="m"
            gap="s"
            className={styles.contact}
          >
            <Button
              href={contact.cvPdfPath}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
              className={styles.contactItem}
            >
              Download PDF
            </Button>

            <a className={styles.contactItem} href={`mailto:${contact.email}`}>
              <span className={styles.contactKey}>Email</span>
              <span className={styles.contactVal}>{contact.email}</span>
            </a>

            <div className={styles.contactItem}>
              <span className={styles.contactKey}>Phone</span>
              <span className={styles.contactVal}>{contact.phone}</span>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.contactKey}>Address</span>
              <span className={styles.contactVal}>{contact.addressEN}</span>
            </div>
          </Column>
        </Column>
      </div>
    </div>
  );
}
