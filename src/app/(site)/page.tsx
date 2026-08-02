import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { SelectedWork } from "@/components/home/SelectedWork";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Marquee } from "@/components/ui/Marquee";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  return {
    description:
      profile.homeSublineEN || profile.summaryEN || `Portfolio of ${profile.name}.`,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  const { profile, projects, skills, experiences, education } = data;
  const titles = projects.map((p) => p.titleEN).filter(Boolean);

  // JSON-LD Person: với portfolio mang tên một cá nhân, đây là tín hiệu SEO có
  // đòn bẩy cao nhất — giúp Google gắn site với con người thật, đủ điều kiện
  // hiện knowledge panel và rich result.
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: profile.email || undefined,
    telephone: profile.phone || undefined,
    image: profile.avatarUrl || undefined,
    description: profile.summaryEN || undefined,
    address: profile.addressEN
      ? { "@type": "PostalAddress", addressLocality: profile.addressEN }
      : undefined,
    knowsAbout: skills.map((s) => s.title),
    worksFor: experiences.map((e) => ({ "@type": "Organization", name: e.company })),
    alumniOf: education.map((ed) => ({ "@type": "EducationalOrganization", name: ed.name })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <Hero profile={profile} />
      <Stats
        projectCount={projects.length}
        skillCount={skills.length}
        experienceCount={experiences.length}
        educationCount={education.length}
      />
      <div className="py-14">
        <Marquee items={titles.length ? titles : ["Architecture", "BIM", "Coordination"]} />
      </div>
      <SelectedWork projects={projects} defaultAspect={profile.cardAspect} />
      <ContactCTA profile={profile} />
    </>
  );
}
