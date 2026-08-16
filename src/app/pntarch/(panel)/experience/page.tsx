import { adminGetExperiences } from "@/lib/admin-data";
import { saveExperience, deleteExperience } from "@/lib/actions";
import { Field, Area, SubmitButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Experience } from "@/lib/types";

export const dynamic = "force-dynamic";

function ExpForm({ exp, order }: { exp?: Experience; order: number }) {
  return (
    <form action={saveExperience} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5">
      {exp && <input type="hidden" name="id" value={exp.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Công ty" name="company" defaultValue={exp?.company} required />
        <Field label="Thời gian (hiển thị)" name="timeframe" defaultValue={exp?.timeframe} placeholder="2022 – Present (Ha Noi)" />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr]">
        <Field label="Năm bắt đầu (trục thời gian CV)" name="startYear" type="number" defaultValue={exp?.startYear ? String(exp.startYear) : ""} placeholder="2022" />
        <Field label="Năm kết thúc — để trống = hiện tại" name="endYear" type="number" defaultValue={exp?.endYear ? String(exp.endYear) : ""} placeholder="" />
        <Field label="Thứ tự" name="sortOrder" type="number" defaultValue={String(exp?.sortOrder ?? order)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vai trò (VI)" name="roleVI" defaultValue={exp?.roleVI} lang="vi" />
        <Field label="Vai trò (EN)" name="roleEN" defaultValue={exp?.roleEN} lang="en" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Area label="Thành tựu (VI) — mỗi dòng 1 ý" name="achievementsVI" defaultValue={exp?.achievementsVI.join("\n")} rows={4} lang="vi" />
        <Area label="Thành tựu (EN) — mỗi dòng 1 ý" name="achievementsEN" defaultValue={exp?.achievementsEN.join("\n")} rows={4} lang="en" />
      </div>
      <div className="flex items-center justify-between">
        <SubmitButton>{exp ? "Cập nhật" : "Thêm kinh nghiệm"}</SubmitButton>
        {exp && <DeleteButton action={deleteExperience.bind(null, exp.id)} />}
      </div>
    </form>
  );
}

export default async function ExperienceAdmin() {
  const items = await adminGetExperiences();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Kinh nghiệm</h2>
        <p className="mt-1 text-sm text-fg-faint">
          Năm bắt đầu / kết thúc vẽ thanh trên trục thời gian của tờ CV. Nếu để trống, hệ thống tự đọc từ ô “Thời gian”.
        </p>
      </div>
      {items.map((e) => (
        <ExpForm key={e.id} exp={e} order={e.sortOrder} />
      ))}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-accent">+ Thêm mới</h3>
        <ExpForm order={items.length} />
      </div>
    </div>
  );
}
