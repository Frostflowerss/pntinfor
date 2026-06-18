"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { saveProfile } from "@/lib/actions";
import { Field, Area, BiField, BiArea, SubmitButton } from "@/components/admin/ui";
import { ImageUploader, PdfUploader } from "@/components/admin/Uploaders";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [saved, setSaved] = useState(false);

  async function action(formData: FormData) {
    await saveProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form action={action} className="space-y-6">
      <h2 className="font-display text-3xl tracking-tight">Hồ sơ &amp; Trang chủ</h2>

      <section className="grid gap-5 rounded-2xl border border-[var(--line)] bg-[var(--ink-soft)]/40 p-5 md:grid-cols-[220px_1fr]">
        <ImageUploader name="avatarUrl" folder="avatar" initialUrl={profile.avatarUrl} label="Ảnh đại diện" aspect="aspect-square" />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Họ tên" name="name" defaultValue={profile.name} required />
            <Field label="Chức danh (role)" name="role" defaultValue={profile.role} />
          </div>
          <PdfUploader name="cvUrl" initialUrl={profile.cvUrl} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] p-5">
        <h3 className="text-sm font-semibold">Liên hệ</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" defaultValue={profile.email} />
          <Field label="Điện thoại" name="phone" defaultValue={profile.phone} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nhãn vị trí (hiển thị)" name="locationLabel" defaultValue={profile.locationLabel} placeholder="Ha Noi" />
          <Field label="Ngôn ngữ (phân cách bằng dấu phẩy)" name="languages" defaultValue={profile.languages.join(", ")} placeholder="Vietnamese, English" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Area label="Địa chỉ (VI)" name="addressVI" defaultValue={profile.addressVI} rows={2} lang="vi" />
          <Area label="Địa chỉ (EN)" name="addressEN" defaultValue={profile.addressEN} rows={2} lang="en" />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--line)] p-5">
        <h3 className="text-sm font-semibold">Trang chủ (Hero)</h3>
        <BiField label="Dòng tiêu đề phụ (headline)" base="homeHeadline" vi={profile.homeHeadlineVI} en={profile.homeHeadlineEN} />
        <BiArea label="Mô tả ngắn (subline)" base="homeSubline" vi={profile.homeSublineVI} en={profile.homeSublineEN} rows={3} />
      </section>

      <section className="rounded-2xl border border-[var(--line)] p-5">
        <h3 className="mb-4 text-sm font-semibold">Giới thiệu (About)</h3>
        <BiArea label="Tóm tắt chuyên môn" base="summary" vi={profile.summaryVI} en={profile.summaryEN} rows={5} />
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton>Lưu hồ sơ</SubmitButton>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
            <Check size={15} /> Đã lưu
          </span>
        )}
      </div>
    </form>
  );
}
