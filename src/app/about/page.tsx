import {
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
import TiltAvatar from "@/components/about/TiltAvatar";
import SoftwareSkillsGrid from "@/components/about/SoftwareSkillsGrid";

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

function ContactMini() {
  return (
    <div className="pnt-contactMini" role="group" aria-label="Contact">
      <a className="pnt-contactRow" href={contact.cvPdfPath} target="_blank" rel="noreferrer">
        <span className="pnt-contactKey">PDF</span>
        <span className="pnt-contactVal">Download CV</span>
      </a>

      <a className="pnt-contactRow" href={`mailto:${contact.email}`}>
        <span className="pnt-contactKey">Email</span>
        <span className="pnt-contactVal">{contact.email}</span>
      </a>

      <a className="pnt-contactRow" href={`tel:${contact.phone}`}>
        <span className="pnt-contactKey">Phone</span>
        <span className="pnt-contactVal">{contact.phone}</span>
      </a>

      <div className="pnt-contactRow" role="note">
        <span className="pnt-contactKey">Address</span>
        <span className="pnt-contactVal">{contact.addressEN}</span>
      </div>
    </div>
  );
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
            <TiltAvatar src={person.avatar} size="xl" />

            <Row gap="s" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              <span className="pnt-vi">Hà Nội</span>
              <span className="pnt-en" style={{ marginLeft: 8 }}>
                Ha Noi
              </span>
            </Row>

            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="s">
                {person.languages.map((language, index) => (
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

            <RevealFx translateY={10} delay={0.08}>
              <ContactMini />
            </RevealFx>
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

              <SoftwareSkillsGrid skills={about.technical.skills} />
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
