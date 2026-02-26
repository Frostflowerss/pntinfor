import { About, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";
import { cv } from "@/resources/cv-data";

const person: Person = {
  firstName: "Pham",
  lastName: "Ngoc Thiem",
  name: "PHAM NGOC THIEM",
  role: "Architect",
  avatar: "/images/avatar.jpg", // update later
  email: cv.contact.email,
  // Used for time display in Header; we disable time/location display in config.
  location: "Asia/Ho_Chi_Minh",
  languages: ["Vietnamese", "English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe</>,
  description: <></>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} – Portfolio`,
  description: `Portfolio website showcasing work as an ${person.role}`,
  headline: <>ARCHITECT</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
      <Text as="span" size="xl" weight="strong">
        {cv.yearsExperience}+ years experience
      </Text>
      <br />
      BIM coordination • Revit/Navisworks • Technical documentation
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `CV – ${person.name}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Professional Summary",

    description: (
      <>
        <Text as="span" className="viText">{cv.professionalSummary.vi}</Text>
        <br />
        <br />
        <Text as="span" className="enText">{cv.professionalSummary.en}</Text>
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: cv.employmentHistory.map((e) => ({
      company: e.company,
      timeframe: e.timeframe,
      role: e.role,
      achievements: e.achievements.map((a) => <>{a}</>),
      images: [],
    })),
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education & Courses",
    institutions: [
      ...cv.education.map((e) => ({
        name: `${e.institution} • ${e.timeframe}`,
        description: <>{e.degree}</>,
      })),
      ...cv.courses.map((c) => ({
        name: `${c.title} • ${c.timeframe}`,
        description: <>{c.note}</>,
      })),
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Software Skills",
    skills: [
      {
        title: "BIM / Autodesk",
        description: (
          <>
            {cv.softwareSkills.left
              .map((s) => `${s.name} — ${s.level}`)
              .join(" • ")}
          </>
        ),
        tags: [{ name: "BIM", icon: "grid" }],
        images: [],
      },
      {
        title: "Adobe / Office",
        description: (
          <>
            {cv.softwareSkills.right
              .map((s) => `${s.name} — ${s.level}`)
              .join(" • ")}
          </>
        ),
        tags: [{ name: "Tools", icon: "sparkles" }],
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects & Experience – ${person.name}`,
  description: `Selected projects and primary roles`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, work, gallery };
