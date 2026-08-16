import { getSiteData } from "@/lib/data";
import { CvStage } from "@/components/cv/CvStage";

export const revalidate = 60;

export default async function CvPage() {
  const data = await getSiteData();
  return <CvStage data={data} />;
}
