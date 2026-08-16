import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { CvSwitcher } from "@/components/cv/CvSwitcher";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae — career timeline, education, projects and software skills on one schedule sheet.",
  alternates: { canonical: "/about" },
};

/**
 * /about — the CV.
 * Opens in COMPACT (full-screen schedule sheet, design 4a); switching to DETAIL
 * reveals the original site layout with the normal header/footer.
 */
export default async function AboutPage() {
  const data = await getSiteData();
  return (
    <div className="cv-page">
      <CvSwitcher data={data} />
    </div>
  );
}
