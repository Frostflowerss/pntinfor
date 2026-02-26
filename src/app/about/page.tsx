import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
  RevealFx,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import { cv } from "@/resources/cv-data";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((e) => e.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((i) => i.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((s) => s.title),
    },
  ];

  return (
    <Column maxWidth="m" paddingX="12">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Table of contents */}
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      <Row fillWidth horizontal="center" s={{ direction: "column" }}>
        {/* LEFT COLUMN */}
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />

            <Row gap="8" vertical="center">
              <Icon name="globe" onBackground="accent-weak" />
              {person.location}
            </Row>

            {person.languages?.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((lang, i) => (
                  <Tag key={i} size="l">
                    {lang}
                  </Tag>
                ))}
              </Row>
            )}

            <Column fillWidth gap="s" paddingTop="12">
              <Row wrap gap="8">
                <Button
                  href={`mailto:${cv.contact.email}`}
                  variant="secondary"
                  size="s"
                  prefixIcon="mail"
                >
                  Email
                </Button>

                <Button
                  href={cv.contact.pdfDownloadPath}
                  variant="secondary"
                  size="s"
                  prefixIcon="download"
                >
                  Download PDF
                </Button>
              </Row>

              <Text variant="body-default-s" onBackground="neutral-weak">
                {cv.contact.phone} • {cv.contact.email}
              </Text>

              <Text variant="body-default-s" onBackground="neutral-weak">
                {cv.contact.address}
              </Text>
            </Column>
          </Column>
        )}

        {/* RIGHT COLUMN */}
        <Column flex={9} maxWidth={40} className={styles.blockAlign}>
          {/* INTRO */}
          <Column
            id={about.intro.title}
            fillWidth
            marginBottom="32"
            vertical="center"
          >
            <Heading variant="display-strong-xl">
              {person.name}
            </Heading>

            <Text
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
          </Column>

          {about.intro.display && (
            <Column fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {/* WORK EXPERIENCE */}
          {about.work.display && (
            <>
              <Heading variant="display-strong-s" marginBottom="m">
                {about.work.title}
              </Heading>

              <Column fillWidth gap="l" marginBottom="40">
                {about.work.experiences.map((exp, i) => (
                  <RevealFx key={i} translateY="8" delay={i * 0.05}>
                    <Column fillWidth>
                      <Row horizontal="between" marginBottom="4">
                        <Text variant="heading-strong-l">
                          {exp.company}
                        </Text>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                          {exp.timeframe}
                        </Text>
                      </Row>

                      <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                        {exp.role}
                      </Text>

                      <Column as="ul" gap="16">
                        {exp.achievements.map((a, idx) => (
                          <Text as="li" key={idx} variant="body-default-m">
                            {a}
                          </Text>
                        ))}
                      </Column>
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* STUDIES */}
          {about.studies.display && (
            <>
              <Heading variant="display-strong-s" marginBottom="m">
                {about.studies.title}
              </Heading>

              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((inst, i) => (
                  <RevealFx key={i} translateY="8" delay={i * 0.05}>
                    <Column fillWidth gap="4">
                      <Text variant="heading-strong-l">
                        {inst.name}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {inst.description}
                      </Text>
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* TECHNICAL */}
          {about.technical.display && (
            <>
              <Heading variant="display-strong-s" marginBottom="40">
                {about.technical.title}
              </Heading>

              <Column fillWidth gap="l">
                {about.technical.skills.map((skill, i) => (
                  <RevealFx key={i} translateY="8" delay={i * 0.05}>
                    <Column fillWidth gap="4">
                      <Text variant="heading-strong-l">
                        {skill.title}
                      </Text>

                      <Text variant="body-default-m" onBackground="neutral-weak">
                        {skill.description}
                      </Text>
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
