import {
  Avatar,
  Column,
  Heading,
  Icon,
  Row,
  Schema,
  Text,
  Meta,
  RevealFx,
} from "@once-ui-system/core";

import { baseURL, about, person } from "@/resources";
import { contact } from "@/resources/profile";
import TableOfContents from "@/components/about/TableOfContents";
import MobileTOC from "@/components/about/MobileTOC";
import styles from "@/components/about/about.module.scss";
import { ProfileSidebar } from "@/components/about/ProfileSidebar";
import { SkillGrid } from "@/components/about/SkillGrid";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

function splitBilingual(label: string): { vi: string; en: string } {
  const parts = label.split("/").map((p) => p.trim());
  if (parts.length >= 2) return { vi: parts[0], en: parts.slice(1).join(" / ") };
  return { vi: label, en: "" };
}

function BilingualTitle({ label }: { label: string }) {
  const { vi, en } = splitBilingual(label);
  return (
    <>
      <span className="pnt-vi">{vi}</span>
      {en ? (
        <>
          <br />
          <span className="pnt-en">{en}</span>
        </>
      ) : null}
    </>
  );
}

function levelToPercent(level: string) {
  switch (level) {
    case "Expert":
      return 100;
    case "Experienced":
      return 78;
    case "Skillful":
      return 58;
    case "Beginner":
      return 32;
    default:
      return 50;
  }
}

export default function About() {
  const structure = [
    { title: about.intro.title, display: about.intro.display, items: [] as string[] },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
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

      {/* Desktop TOC */}
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="l"
          gap="xl"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      {/* Mobile TOC */}
      {about.tableOfContent.display && (
        <Row hide s={{ hide: false }}>
          <MobileTOC structure={structure} />
        </Row>
      )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="xl"
            fitHeight
            position="sticky"
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <ProfileSidebar
              avatarSrc={person.avatar}
              locationLabel="Ha Noi"
              languages={person.languages ?? []}
              contact={{
                cvPdfPath: contact.cvPdfPath,
                email: contact.email,
                phone: contact.phone,
                addressEN: contact.addressEN,
              }}
            />
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={44}>
          <Column fillWidth minHeight="160" vertical="center" marginBottom="l">
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
          </Column>

          {about.intro.display && (
            <Column fillWidth gap="m" marginBottom="xl">
              <Heading as="h2" variant="display-strong-s" id={about.intro.title}>
                <BilingualTitle label={about.intro.title} />
              </Heading>
              <Column textVariant="body-default-l" fillWidth gap="m">
                {about.intro.description}
              </Column>
            </Column>
          )}

          {/* Employment History (no images, compact cards) */}
          {about.work.display && (
            <>
              <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
                <BilingualTitle label={about.work.title} />
              </Heading>

              <Column fillWidth gap="l" marginBottom="xl">
                {about.work.experiences.map((experience, index) => (
                  <RevealFx
                    key={`${experience.company}-${experience.role}-${index}`}
                    translateY={12}
                    delay={0.05 * index}
                  >
                    <Column
                      fillWidth
                      border="neutral-alpha-weak"
                      background="neutral-alpha-weak"
                      radius="l"
                      padding="l"
                      gap="m"
                    >
                      <Row fillWidth horizontal="between" vertical="end" wrap>
                        <Text variant="heading-strong-l">{experience.company}</Text>
                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                          {experience.timeframe}
                        </Text>
                      </Row>

                      <Text variant="body-default-s" onBackground="brand-weak">
                        {experience.role}
                      </Text>

                      <Column as="ul" gap="m">
                        {experience.achievements.map((achievement, idx) => (
                          <Text as="li" variant="body-default-m" key={`${experience.company}-${idx}`}>
                            {achievement}
                          </Text>
                        ))}
                      </Column>
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* Education & Courses */}
          {about.studies.display && (
            <>
              <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                <BilingualTitle label={about.studies.title} />
              </Heading>

              <Column fillWidth gap="l" marginBottom="xl">
                {about.studies.institutions.map((institution, index) => (
                  <RevealFx key={`${institution.name}-${index}`} translateY={10} delay={0.04 * index}>
                    <Column
                      fillWidth
                      gap="s"
                      border="neutral-alpha-weak"
                      background="neutral-alpha-weak"
                      radius="l"
                      padding="l"
                    >
                      <Text variant="heading-strong-l">{institution.name}</Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {institution.description}
                      </Text>
                    </Column>
                  </RevealFx>
                ))}
              </Column>
            </>
          )}

          {/* Software Skills (2 columns) */}
          {about.technical.display && (
            <>
              <Heading
                as="h2"
                id={about.technical.title}
                variant="display-strong-s"
                marginBottom="m"
              >
                <BilingualTitle label={about.technical.title} />
              </Heading>

              <SkillGrid skills={about.technical.skills} levelToPercent={levelToPercent} />
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
