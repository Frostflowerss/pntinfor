import { cv } from "@/resources/cv-data";
import { Badge, Column, Line, Row, Text } from "@once-ui-system/core";

type CVProjectsProps = {
  range?: [number, number?];
};

export function CVProjects({ range }: CVProjectsProps) {
  const items = range
    ? cv.featuredProjects.slice(range[0] - 1, range[1] ?? cv.featuredProjects.length)
    : cv.featuredProjects;

  return (
    <Column fillWidth gap="l" marginBottom="40" paddingX="l">
      {items.map((p, idx) => (
        <Column
          key={`${p.name}-${idx}`}
          fillWidth
          padding="l"
          radius="m-4"
          background="neutral-alpha-weak"
          border="neutral-alpha-medium"
        >
          <Row fillWidth horizontal="between" vertical="center" gap="12" wrap>
            <Text variant="heading-strong-m">{p.name}</Text>
            <Row gap="8" vertical="center" wrap>
              <Badge
                background="brand-alpha-weak"
                onBackground="brand-strong"
                paddingX="10"
                paddingY="4"
                textVariant="label-default-s"
              >
                Class {p.constructionClass}
              </Badge>
            </Row>
          </Row>
          <Line marginTop="12" marginBottom="12" background="neutral-alpha-medium" />
          <Text onBackground="neutral-weak" variant="body-default-m">
            {p.role}
          </Text>
        </Column>
      ))}
    </Column>
  );
}
