"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { saveProject } from "@/lib/actions";
import { BiField, BiArea, Field, SubmitButton } from "@/components/admin/ui";
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
            initial={project?.images.map((i) => i.url) ?? []}
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
