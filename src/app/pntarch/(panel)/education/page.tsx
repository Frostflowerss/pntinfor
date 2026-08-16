import { adminGetEducation } from "@/lib/admin-data";
import { saveEducation, deleteEducation } from "@/lib/actions";
import { Field, Area, Select, SubmitButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Education } from "@/lib/types";

export const dynamic = "force-dynamic";

function EduForm({ ed, order }: { ed?: Education; order: number }) {
  return (
    <form action={saveEducation} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5">
      {ed && <input type="hidden" name="id" value={ed.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
        <Field label="Tên trường / khóa học" name="name" defaultValue={ed?.name} required />
        <Select
          label="Loại"
          name="kind"
          defaultValue={ed?.kind ?? "course"}
          options={[
            { value: "degree", label: "Bằng cấp (thanh rỗng)" },
            { value: "course", label: "Khóa học / chứng chỉ (kim cương)" },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Area label="Mô tả (VI)" name="descriptionVI" defaultValue={ed?.descriptionVI} rows={2} lang="vi" />
        <Area label="Mô tả (EN)" name="descriptionEN" defaultValue={ed?.descriptionEN} rows={2} lang="en" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Năm bắt đầu" name="startYear" type="number" defaultValue={ed?.startYear ? String(ed.startYear) : ""} placeholder="2016" />
        <Field label="Năm kết thúc (bằng cấp)" name="endYear" type="number" defaultValue={ed?.endYear ? String(ed.endYear) : ""} placeholder="2021" />
        <Field label="Thứ tự" name="sortOrder" type="number" defaultValue={String(ed?.sortOrder ?? order)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Nhãn ngắn trên CV (VI)" name="shortVI" defaultValue={ed?.shortVI} placeholder="Điều phối BIM" lang="vi" />
        <Field label="Nhãn ngắn trên CV (EN)" name="shortEN" defaultValue={ed?.shortEN} placeholder="BIM Coordinator" lang="en" />
        <Field label="Đơn vị cấp" name="issuer" defaultValue={ed?.issuer} placeholder="Vecas – Autodesk" />
      </div>
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
      <div>
        <h2 className="font-display text-3xl tracking-tight">Học vấn &amp; khóa học</h2>
        <p className="mt-1 text-sm text-fg-faint">
          Trên tờ CV: bằng cấp là thanh rỗng theo năm bắt đầu → kết thúc; khóa học là kim cương tại năm. Nhãn ngắn / đơn vị cấp để trống sẽ tự suy ra từ mô tả.
        </p>
      </div>
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
