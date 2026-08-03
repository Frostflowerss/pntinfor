"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveProject } from "@/lib/actions";
import { BiField, BiArea, Field, Select, SubmitButton } from "@/components/admin/ui";
import { ImageUploader, MultiImageUploader } from "@/components/admin/Uploaders";
import type { Project } from "@/lib/types";

export function ProjectForm({ project, nextOrder }: { project?: Project; nextOrder: number }) {
  const isEdit = Boolean(project);

  return (
    <div>
      <Link
        href="/pntarch/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft size={15} /> Danh sách dự án
      </Link>

      <h2 className="mb-6 font-display text-3xl tracking-tight">
        {isEdit ? "Sửa dự án" : "Thêm dự án mới"}
      </h2>

      <form action={saveProject} className="space-y-6">
        {project && <input type="hidden" name="id" value={project.id} />}

        {/* Images */}
        <section className="grid gap-5 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5 md:grid-cols-[300px_1fr]">
          <ImageUploader
            name="coverUrl"
            folder="projects"
            initialUrl={project?.coverUrl}
            label="Ảnh bìa (cover)"
            aspect="aspect-[16/11]"
          />
          <MultiImageUploader
            name="imagesJson"
            folder="projects"
            initial={
              project?.images.map((i) => ({
                url: i.url,
                width: i.width,
                height: i.height,
              })) ?? []
            }
          />
        </section>

        {/* Titles */}
        <BiField label="Tên dự án" base="title" vi={project?.titleVI} en={project?.titleEN} placeholder="Tên dự án" />

        <div className="grid gap-5 sm:grid-cols-2">
          <BiField
            label="Cấp công trình"
            base="constructionClass"
            vi={project?.constructionClassVI}
            en={project?.constructionClassEN}
            placeholder="VD: Cấp II / Class II"
          />
          <BiField
            label="Địa điểm"
            base="location"
            vi={project?.locationVI}
            en={project?.locationEN}
            placeholder="VD: Hà Nội / Ha Noi"
          />
        </div>

        <BiField
          label="Vai trò chính"
          base="primaryRole"
          vi={project?.primaryRoleVI}
          en={project?.primaryRoleEN}
          placeholder="VD: Điều phối BIM / BIM Coordinator"
        />

        <BiArea label="Tổng quan" base="overview" vi={project?.overviewVI} en={project?.overviewEN} rows={4} />

        <BiArea
          label="Vai trò / công việc đã làm"
          base="responsibilities"
          vi={project?.responsibilitiesVI.join("\n")}
          en={project?.responsibilitiesEN.join("\n")}
          rows={5}
          hint="Mỗi dòng là một gạch đầu dòng. Số dòng VI và EN nên khớp nhau."
        />

        <section className="grid gap-5 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5 sm:grid-cols-[auto_1fr_1fr] sm:items-end">
          <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Hiển thị ở mục 01 (Tiêu biểu)
          </label>
          <Field
            label="Thứ tự trong mục Tiêu biểu"
            name="featuredOrder"
            type="number"
            defaultValue={String(project?.featuredOrder ?? 0)}
          />
          <Select
            label="Tỉ lệ ảnh riêng (ghi đè mặc định)"
            name="aspect"
            defaultValue={project?.aspect ?? ""}
            options={[
              { value: "", label: "Theo mặc định trang" },
              { value: "16/11", label: "16:11" },
              { value: "16/9", label: "16:9 (rộng)" },
              { value: "4/3", label: "4:3" },
              { value: "1/1", label: "1:1 (vuông)" },
              { value: "3/4", label: "3:4 (dọc)" },
            ]}
          />
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Slug (đường dẫn) — để trống sẽ tự tạo"
            name="slug"
            defaultValue={project?.slug}
            placeholder="vd: long-thanh-airport"
          />
          <Field
            label="Thứ tự hiển thị"
            name="sortOrder"
            type="number"
            defaultValue={String(project?.sortOrder ?? nextOrder)}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton>{isEdit ? "Cập nhật dự án" : "Tạo dự án"}</SubmitButton>
          <Link href="/pntarch/projects" className="text-sm text-fg-muted hover:text-fg">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
