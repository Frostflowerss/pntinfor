import { adminGetSkills } from "@/lib/admin-data";
import { saveSkill, deleteSkill } from "@/lib/actions";
import { Field, SubmitButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Skill } from "@/lib/types";

export const dynamic = "force-dynamic";

const LEVELS = ["Expert", "Experienced", "Skillful", "Beginner"];
const selectCls =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-3 py-2.5 text-sm outline-none focus:border-accent";

function SkillForm({ skill, order }: { skill?: Skill; order: number }) {
  return (
    <form
      action={saveSkill}
      className="grid items-end gap-3 rounded-xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-4 sm:grid-cols-[1fr_140px_110px_auto]"
    >
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <Field label="Phần mềm" name="title" defaultValue={skill?.title} required />
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-fg-muted">Trình độ</span>
        <select name="level" defaultValue={skill?.level ?? "Skillful"} className={selectCls}>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <Field label="%" name="percent" type="number" defaultValue={String(skill?.percent ?? 60)} />
      <input type="hidden" name="sortOrder" value={skill?.sortOrder ?? order} />
      <div className="flex items-center gap-2">
        <SubmitButton>{skill ? "Lưu" : "Thêm"}</SubmitButton>
        {skill && <DeleteButton compact action={deleteSkill.bind(null, skill.id)} />}
      </div>
    </form>
  );
}

export default async function SkillsAdmin() {
  const items = await adminGetSkills();
  return (
    <div className="space-y-4">
      <h2 className="mb-2 font-display text-3xl tracking-tight">Kĩ năng phần mềm</h2>
      <p className="text-sm text-fg-faint">% điều khiển độ dài thanh kĩ năng trên trang About.</p>
      {items.map((s) => (
        <SkillForm key={s.id} skill={s} order={s.sortOrder} />
      ))}
      <div className="pt-2">
        <h3 className="mb-3 text-sm font-semibold text-accent">+ Thêm mới</h3>
        <SkillForm order={items.length} />
      </div>
    </div>
  );
}
