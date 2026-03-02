"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Column, Icon, Row, Text } from "@once-ui-system/core";
import styles from "./ProfileSidebar.module.scss";

type ContactInfo = {
  cvPdfPath: string;
  email: string;
  phone: string;
  addressEN: string;
};

export function ProfileSidebar({
  avatarSrc,
  locationLabel,
  languages,
  contact,
}: {
  avatarSrc: string;
  locationLabel: string;
  languages: string[];
  contact: ContactInfo;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const items = useMemo(
    () => [
      { label: "Download PDF", value: "CV.pdf", href: contact.cvPdfPath },
      { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
      { label: "Phone", value: contact.phone, href: `tel:${contact.phone}` },
      { label: "Address", value: contact.addressEN, href: undefined },
    ],
    [contact],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Small, premium tilt. Clamp to avoid nausea.
    const ry = (x - 0.5) * 10;
    const rx = -(y - 0.5) * 8;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ rx, ry });
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        // CSS vars used by the SCSS transform.
        // Keep as numbers so they can be interpolated in CSS.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "--rx": `${tilt.rx}deg`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "--ry": `${tilt.ry}deg`,
      }}
    >
      <div className={styles.avatarWrap}>
        <Avatar src={avatarSrc} size="xl" />
      </div>

      <Row gap="s" vertical="center">
        <Icon onBackground="accent-weak" name="globe" />
        <span className={styles.location}>{locationLabel}</span>
      </Row>

      {languages.length > 0 && (
        <Row wrap gap="s">
          {languages.map((language, index) => (
            <Row
              key={index}
              border="neutral-alpha-weak"
              background="neutral-alpha-weak"
              radius="full"
              paddingX="m"
              paddingY="s"
            >
              <Text variant="label-default-s">{language}</Text>
            </Row>
          ))}
        </Row>
      )}

      <div className={styles.contact} role="group" aria-label="Contact">
        {items.map((it) => (
          <div key={it.label} className={styles.contactItem}>
            <div className={styles.contactLabel}>{it.label}</div>
            {it.href ? (
              <a className={styles.contactValue} href={it.href} target={it.href.startsWith("/") ? "_blank" : undefined} rel={it.href.startsWith("/") ? "noreferrer" : undefined}>
                {it.value}
              </a>
            ) : (
              <div className={styles.contactValue}>{it.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
