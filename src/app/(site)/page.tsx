import { getSiteData } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Marquee } from "@/components/ui/Marquee";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getSiteData();
  const titles = data.projects.map((p) => p.titleEN).filter(Boolean);

  return (
    <>
      <Hero profile={data.profile} />
      <Stats projectCount={data.projects.length} />
      <div className="py-14">
        <Marquee items={titles.length ? titles : ["Architecture", "BIM", "Coordination"]} />
      </div>
      <SelectedWork projects={data.projects} />
    </>
  );
}
