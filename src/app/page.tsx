import { Button, Column, Meta, Row, Schema } from "@once-ui-system/core";
import { about, home, person, baseURL } from "@/resources";
import { HomeGallery } from "@/components/home/HomeGallery";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

const homeImages = [
  { src: "/images/gallery/horizontal-1.jpg", alt: "Gallery image 1" },
  { src: "/images/gallery/horizontal-2.jpg", alt: "Gallery image 2" },
  { src: "/images/gallery/horizontal-3.jpg", alt: "Gallery image 3" },
  { src: "/images/gallery/horizontal-4.jpg", alt: "Gallery image 4" },
  { src: "/images/gallery/vertical-1.jpg", alt: "Gallery image 5" },
  { src: "/images/gallery/vertical-2.jpg", alt: "Gallery image 6" },
  { src: "/images/gallery/vertical-3.jpg", alt: "Gallery image 7" },
  { src: "/images/gallery/vertical-4.jpg", alt: "Gallery image 8" },
  { src: "/images/projects/project-01/cover-01.jpg", alt: "Project cover 1" },
  { src: "/images/projects/project-01/cover-02.jpg", alt: "Project cover 2" },
];

export default function Home() {
  return (
    <Column maxWidth="m" gap="l" paddingTop="16" paddingBottom="24" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Row fillWidth horizontal="center" paddingBottom="8">
        <Button href={about.path} variant="secondary" size="m" weight="default" arrowIcon>
          About
        </Button>
      </Row>

      <HomeGallery images={homeImages} />
    </Column>
  );
}
