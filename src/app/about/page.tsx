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
import skillStyles from "@/components/about/skill-bars.module.scss";

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

function ContactBar() {
  return (
    <div className="pnt-contactBar" role="group" aria-label="Contact">
      <div className="pnt-contactItem">
        <div className="pnt-bilingual">
          <span className="pnt-vi">Tải CV (PDF)</span>
          <span className="pnt-en">Download PDF</span>
        </div>
        <div className="pnt-contactValue">
          <a className="pnt-en" href={contact.cvPdfPath} target="_blank" rel="noreferrer">
            CV.pdf
          </a>
        </div>
      </div>

      <div className="pnt-contactItem">
        <div className="pnt-bilingual">
          <span className="pnt-vi">Email</span>
          <span className="pnt-en">Email</span>
        </div>
        <div className="pnt-contactValue">
          <a className="pnt-en" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>
      </div>

      <div className="pnt-contactItem">
        <div className="pnt-bilingual">
          <span className="pnt-vi">Điện thoại</span>
          <span className="pnt-en">Phone</span>
        </div>
        <div className="pnt-contactValue">
          <a className="pnt-en" href={`tel:${contact.phone}`}>
            {contact.phone}
          </a>
        </div>
      </div>

      <div className="pnt-contactItem">
        <div className="pnt-bilingual">
          <span className="pnt-vi">Địa chỉ</span>
          <span className="pnt-en">Address</span>
        </div>
        <div className="pnt-bilingual">
          <span className="pnt-vi">{contact.addressVI}</span>
          <span className="pnt-en">{contact.addressEN}</span>
        </div>
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

  const skills = about.technical.skills;
  const splitAt = Math.ceil(skills.length / 2);
  const skillsLeft = skills.slice(0, splitAt);
  const skillsRight = skills.slice(splitAt);

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
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />

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

          {/* Contact bar (centered) */}
          <RevealFx translateY={8} delay={0.06}>
            <Column fillWidth horizontal="center" marginBottom="xl">
              <ContactBar />
            </Column>
          </RevealFx>

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

              <div className={skillStyles.skillGrid}>
                {[skillsLeft, skillsRight].map((col, colIdx) => (
                  <Column key={colIdx} fillWidth>
                    {col.map((skill, index) => {
                      const level = skill.tags?.[0]?.name ?? "";
                      const percent = levelToPercent(level);
                      const delay = 0.03 * (colIdx * splitAt + index);
                      return (
                        <RevealFx key={`${skill.title}-${colIdx}-${index}`} translateY={10} delay={delay}>
                          <div className={skillStyles.skillRow}>
                            <div className={skillStyles.top}>
                              <Text variant="heading-strong-l">{skill.title}</Text>
                              <div className={skillStyles.level}>
                                <Text variant="body-default-s" onBackground="neutral-weak">
                                  {skill.description}
                                </Text>
                              </div>
                            </div>
                            <div className={skillStyles.bar} aria-label={`${skill.title} level ${level}`}>
                              <div className={skillStyles.fill} style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        </RevealFx>
                      );
                    })}
                  </Column>
                ))}
              </div>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}
