import { CountUp } from "@/components/ui/motion";
import { Reveal } from "@/components/ui/motion";

export function Stats({ projectCount }: { projectCount: number }) {
  const stats = [
    { value: 6, suffix: "+", labelVI: "Năm kinh nghiệm", labelEN: "Years of experience" },
    { value: projectCount, suffix: "", labelVI: "Dự án tiêu biểu", labelEN: "Featured projects" },
    { value: 3, suffix: "", labelVI: "Lĩnh vực chuyên môn", labelEN: "Areas of expertise" },
    { value: 10, suffix: "+", labelVI: "Phần mềm thành thạo", labelEN: "Software tools" },
  ];

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
              <div className="en text-xs">{s.labelEN}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
