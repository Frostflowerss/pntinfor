import { CountUp, Reveal } from "@/components/ui/motion";

/**
 * Số liệu suy ra từ dữ liệu thật trong panel.
 *
 * Bản cũ hardcode "6+ năm", "3 lĩnh vực", "10+ phần mềm" — chỉ số dự án là
 * thật. Với một trang xây uy tín nghề nghiệp, con số không kiểm chứng được và
 * không tự cập nhật là rủi ro niềm tin, nên mọi giá trị ở đây đều đếm từ dữ
 * liệu; mục nào không có dữ liệu thì tự ẩn.
 */
export function Stats({
  projectCount,
  skillCount,
  experienceCount,
  educationCount,
}: {
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  educationCount: number;
}) {
  const stats = [
    { value: projectCount, suffix: "", labelVI: "Dự án", labelEN: "Projects" },
    { value: skillCount, suffix: "", labelVI: "Phần mềm thành thạo", labelEN: "Software tools" },
    { value: experienceCount, suffix: "", labelVI: "Nơi đã làm việc", labelEN: "Workplaces" },
    { value: educationCount, suffix: "", labelVI: "Học vấn & khóa học", labelEN: "Qualifications" },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="shell border-y border-[var(--line)] py-12">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.labelEN} delay={i * 0.08}>
            <div>
              <div className="font-display text-4xl font-light tracking-tight sm:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 vi text-sm">{s.labelVI}</div>
              <div lang="en" className="en text-xs">{s.labelEN}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
