"use client";

import { Carousel, Column, Heading, Row } from "@once-ui-system/core";
import { homeShowcaseImages } from "@/resources/portfolio-data";

export function HomeShowcase() {
  return (
    <Column fillWidth gap="m" paddingX="l" paddingTop="24" paddingBottom="40">
      <Row fillWidth paddingLeft="12">
        <Heading as="h2" variant="heading-strong-l" wrap="balance">
          <span className="pnt-vi">Hình ảnh nổi bật</span>
          <br />
          <span className="pnt-en">Featured images</span>
        </Heading>
      </Row>
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={homeShowcaseImages.map((src, idx) => ({
          slide: src,
          alt: `Showcase ${idx + 1}`,
        }))}
      />
    </Column>
  );
}
