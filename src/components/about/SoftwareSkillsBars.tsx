import { Column, Row, Text } from "@once-ui-system/core";
import { cv } from "@/resources/cv-data";

const levelToPercent: Record<string, number> = {
  Beginner: 35,
  Experienced: 78,
  Skillful: 68,
  Expert: 90,
};

function SkillBar({ name, level }: { name: string; level: string }) {
  const pct = levelToPercent[level] ?? 50;
  return (
    <Row fillWidth horizontal="between" gap="l" paddingY="8" wrap>
      <Column flex={3} gap="2">
        <Text variant="body-default-m">{name}</Text>
        <Text variant="label-default-s" onBackground="neutral-weak">
          {level}
        </Text>
      </Column>
      <Column flex={6} gap="6">
        <Row fillWidth horizontal="between">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Proficiency
          </Text>
          <Text variant="label-default-s" onBackground="brand-medium">
            {pct}%
          </Text>
        </Row>
        <div
          style={{
            width: "100%",
            height: 8,
            borderRadius: 999,
            background: "var(--neutral-alpha-medium)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 999,
              background: "var(--brand-medium)",
            }}
          />
        </div>
      </Column>
    </Row>
  );
}

export function SoftwareSkillsBars() {
  return (
    <Row fillWidth gap="xl" wrap>
      <Column flex={1} gap="s">
        {cv.softwareSkills.left.map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} />
        ))}
      </Column>
      <Column flex={1} gap="s">
        {cv.softwareSkills.right.map((s) => (
          <SkillBar key={s.name} name={s.name} level={s.level} />
        ))}
      </Column>
    </Row>
  );
}
