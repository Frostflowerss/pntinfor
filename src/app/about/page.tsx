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
    baseURL,
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
      items: [],
    },
  ];

  return (
    <Column maxWidth="m">
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

      {about.tableOfContent.display && (
        <Column
          left="0"
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      <Row fillWidth horizontal="center" s={{ direction: "column" }}>
        {/* SIDEBAR */}
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            horizontal="center"
            flex={3}
          >
            <Avatar src={person.avatar} size="xl" />

            <Row gap="8" vertical="center">
              <Icon name="globe" onBackground="accent-weak" />
              {person.location}
            </Row>

            {person.languages?.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((lang, i) => (
                  <Tag key={i}>{lang}</Tag>
                ))}
              </Row>
            )}

            <Column gap="12" paddingTop="16">
              <Row gap="8" wrap horizontal="center">
                <Button
                  href={cv.contact.pdfDownloadPath}
                  variant="secondary"
                  size="s"
                  prefixIcon="download"
                >
                  Download PDF
                </Button>
                <Button
                  href={`mailto:${cv.contact.email}`}
                  variant="secondary"
                  size="s"
                  prefixIcon="email"
                >
                  Email
                </Button>
              </Row>

              <Text variant="body-default-s" onBackground="neutral-weak">
                {cv.contact.phone}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {cv.contact.address}
              </Text>
            </Column>
          </Column>
        )}

        {/* MAIN */}
        <Column flex={9} maxWidth={40} className={styles.blockAlign}>
          {/* INTRO */}
          <Heading variant="display-strong-xl">
            {person.name}
          </Heading>
          <Text variant="display-default-xs" onBackground="neutral-weak">
            {person.role}
          </Text>

          {about.intro.display && (
            <Column marginTop="l" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {/* WORK */}
          {about.work.display && (
            <>
              <Heading as="h2" marginBottom="m">
                {about.work.title}
              </Heading>

              <Column gap="l" marginBottom="40">
                {about.work.experiences.map((exp, i) => (
                  <RevealFx key={`work-${i}`} translateY="12" delay={0.05 * i}>
                    <Column gap="8">
                      <Row horizontal="between">
                        <Text variant="heading-strong-l">
                          {exp.company}
                        </Text>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                          {exp.timeframe}
                        </Text>
                      </Row>

                      <Text variant="body-default-s" onBackground="brand-weak">
                        {exp.role}
                      </Text>

                      <Column as="ul" gap="8">
                        {exp.achievements.map((a, idx) => (
                          <Text as="li" key={idx}>
                            {a}
                          </Text>
                        ))}
                      </Column>

                      {exp.images?.length > 0 && (
                        <Row gap="12" wrap paddingTop="m">
                          {exp.images.map((img, idx) => (
                            <Media
                              key={idx}
                              src={img.src}
                              alt={img.alt}
                              sizes="200px"
                              radius="m"
                              enlarge
                            />
                          ))}
                        </Row>
                      )}
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* STUDIES */}
          {about.studies.display && (
            <>
              <Heading as="h2" marginBottom="m">
                {about.studies.title}
              </Heading>

              <Column gap="l" marginBottom="40">
                {about.studies.institutions.map((inst, i) => (
                  <RevealFx key={`study-${i}`} translateY="10">
                    <Column gap="4">
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
              <Heading as="h2" marginBottom="m">
                {about.technical.title}
              </Heading>

              <Row gap="xl" wrap>
                {[...cv.softwareSkills.left, ...cv.softwareSkills.right].map(
                  (s, i) => (
                    <Column key={i} minWidth="280" gap="8">
                      <Row horizontal="between">
                        <Column>
                          <Text variant="heading-strong-s">{s.name}</Text>
                          <Text variant="body-default-xs" onBackground="neutral-weak">
                            {s.level}
                          </Text>
                        </Column>
                        <Text variant="body-default-xs" onBackground="brand-weak">
                          {s.percent ?? 0}%
                        </Text>
                      </Row>

                      <div
                        style={{
                          width: "100%",
                          height: 8,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.14)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${s.percent ?? 0}%`,
                            height: "100%",
                            background: "var(--brand-strong)",
                            transition: "width 600ms ease",
                          }}
                        />
                      </div>
                    </Column>
                  ),
                )}
              </Row>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
