import { adminGetSkills } from "@/lib/admin-data";
import { saveSkill, deleteSkill } from "@/lib/actions";
import { Field, Select, SubmitButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Skill } from "@/lib/types";

export const dynamic = "force-dynamic";

const LEVELS = [
  { value: "Expert", label: "Expert — EXP" },
  { value: "Experienced", label: "Experienced — ADV" },
  { value: "Skillful", label: "Skillful — SKI" },
  { value: "Beginner", label: "Beginner — BAS" },
];

function SkillForm({ skill, order }: { skill?: Skill; order: number }) {
  return (
    <form
      action={saveSkill}
      className="grid items-end gap-3 rounded-xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-4 sm:grid-cols-[1fr_130px_170px_90px_auto]"
    >
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <Field label="Phần mềm" name="title" defaultValue={skill?.title} required />
      <Field label="Tên ngắn (CV)" name="shortTitle" defaultValue={skill?.shortTitle} placeholder="Revit" />
      <Select label="Trình độ" name="level" defaultValue={skill?.level ?? "Skillful"} options={LEVELS} />
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
      <div>
        <h2 className="font-display text-3xl tracking-tight">Kĩ năng phần mềm</h2>
        <p className="mt-1 text-sm text-fg-faint">
          % là độ dài thanh; Trình độ quyết định màu và mã (EXP / ADV / SKI / BAS) trên tờ CV. Tên ngắn để trống sẽ tự bỏ tiền tố hãng (Autodesk, Adobe…). Tờ Compact hiển thị tối đa 11 kĩ năng đầu.
        </p>
      </div>
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
