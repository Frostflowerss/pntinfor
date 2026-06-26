import { adminGetEducation } from "@/lib/admin-data";
import { saveEducation, deleteEducation } from "@/lib/actions";
import { Field, Area, SubmitButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Education } from "@/lib/types";

export const dynamic = "force-dynamic";

function EduForm({ ed, order }: { ed?: Education; order: number }) {
  return (
    <form action={saveEducation} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5">
      {ed && <input type="hidden" name="id" value={ed.id} />}
      <Field label="Tên trường / khóa học" name="name" defaultValue={ed?.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Area label="Mô tả (VI)" name="descriptionVI" defaultValue={ed?.descriptionVI} rows={2} lang="vi" />
        <Area label="Mô tả (EN)" name="descriptionEN" defaultValue={ed?.descriptionEN} rows={2} lang="en" />
      </div>
      <Field label="Thứ tự" name="sortOrder" type="number" defaultValue={String(ed?.sortOrder ?? order)} />
      <div className="flex items-center justify-between">
        <SubmitButton>{ed ? "Cập nhật" : "Thêm học vấn"}</SubmitButton>
        {ed && <DeleteButton action={deleteEducation.bind(null, ed.id)} />}
      </div>
    </form>
  );
}

export default async function EducationAdmin() {
  const items = await adminGetEducation();
  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl tracking-tight">Học vấn &amp; khóa học</h2>
      {items.map((e) => (
        <EduForm key={e.id} ed={e} order={e.sortOrder} />
      ))}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-accent">+ Thêm mới</h3>
        <EduForm order={items.length} />
      </div>
    </div>
  );
}
