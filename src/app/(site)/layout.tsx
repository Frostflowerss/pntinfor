import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MeshNetwork } from "@/components/ui/MeshNetwork";
import { CvViewProvider } from "@/components/cv/CvViewProvider";
import { getSiteData } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { projects, skills, experiences, education } = await getSiteData();
  const counts = {
    work: projects.length,
    skills: skills.length,
    experience: experiences.length,
    education: education.length,
  };

  return (
    <CvViewProvider>
      <MeshNetwork counts={counts} />
      <Header />
      <main className="relative min-h-screen pt-28 sm:pt-32">{children}</main>
      <Footer />
    </CvViewProvider>
  );
}
