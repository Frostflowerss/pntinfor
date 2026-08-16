import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae — career timeline, education, projects and software skills on one schedule sheet.",
};

/**
 * The CV is a standalone full-screen "site" at the root URL:
 * no header, footer or ambient background — the sheet is the whole screen.
 * DETAIL (inside the sheet) leads to the original website at /home.
 */
export default function CvLayout({ children }: { children: React.ReactNode }) {
  return <div className="cv-stage">{children}</div>;
}
