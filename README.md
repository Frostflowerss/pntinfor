import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ImageOff } from "lucide-react";
import { adminGetProjects } from "@/lib/admin-data";
import { deleteProject } from "@/lib/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await adminGetProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Dự án</h2>
          <p className="text-sm text-fg-faint">{projects.length} dự án</p>
        </div>
        <Link
          href="/pntarch/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus size={16} /> Thêm dự án
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--line)] py-20 text-center text-fg-faint">
          <p>Chưa có dự án. Bấm “Thêm dự án” để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--ink-soft)] p-3"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--paper-soft)]">
                {p.coverUrl ? (
                  <Image src={p.coverUrl} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="grid h-full place-items-center text-fg-faint">
                    <ImageOff size={18} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.titleVI || p.titleEN || "(chưa đặt tên)"}</p>
                <p className="truncate text-xs text-fg-faint">
                  {p.locationEN} · /{p.slug} · {p.images.length} ảnh
                </p>
              </div>
              <Link
                href={`/pntarch/projects/${p.id}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted transition hover:bg-white/5 hover:text-fg"
              >
                <Pencil size={15} />
              </Link>
              <DeleteButton compact action={deleteProject.bind(null, p.id)} confirmText={`Xóa dự án "${p.titleVI || p.titleEN}"?`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
