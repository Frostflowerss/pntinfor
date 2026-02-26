import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, work } from "@/resources";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    path: work.path,
    image: work.image,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingX="12" paddingTop="16" paddingBottom="24" gap="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={work.title}
        description={work.description}
        path={work.path}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
      />
      <Heading as="h1" variant="display-strong-s">
        {work.title}
      </Heading>
      <Projects />
    </Column>
  );
}
