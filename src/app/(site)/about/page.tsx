import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { CvSwitcher } from "@/components/cv/CvSwitcher";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae — career timeline, education, projects and software skills on one schedule sheet.",
  alternates: { canonical: "/about" },
};

/**
 * /about — the CV.
 * Opens in COMPACT (one-screen schedule sheet, design 4a) every time;
 * DETAIL is the long-form page (original layout) one click away.
 */
export default async function AboutPage() {
  const data = await getSiteData();
  return (
    <div className="shell pb-10" style={{ "--max": "92rem" } as React.CSSProperties}>
      <CvSwitcher data={data} />
    </div>
  );
}
