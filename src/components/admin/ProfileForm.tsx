"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { saveProfile } from "@/lib/actions";
import { Field, Area, BiField, BiArea, Select, SubmitButton } from "@/components/admin/ui";
import { ImageUploader, PdfUploader } from "@/components/admin/Uploaders";
import type { Profile } from "@/lib/types";

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function ColorField({
  name,
  label,
  defaultValue,
  inheritLabel,
}: {
  name: string;
  label: string;
  defaultValue: string;
  inheritLabel?: string; // if set, allow "use accent" (empty value)
}) {
  const [inherit, setInherit] = useState(inheritLabel ? !defaultValue : false);
  const [color, setColor] = useState(HEX.test(defaultValue) ? defaultValue : "#5c8cff");
  const value = inherit ? "" : color;

  return (
    <div className="rounded-xl border border-[var(--line)] p-4">
      <input type="hidden" name={name} value={value} readOnly />
      <span className="mb-3 block text-xs font-medium text-fg-muted">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          disabled={inherit}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-[var(--line)] bg-transparent disabled:opacity-40"
          aria-label={label}
        />
        <input
          type="text"
          value={color}
          disabled={inherit}
          onChange={(e) => {
            const v = e.target.value;
            setColor(v.startsWith("#") ? v : "#" + v);
          }}
          placeholder="#5c8cff"
          className="w-32 rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-3 py-2 font-mono text-sm outline-none focus:border-accent disabled:opacity-40"
        />
        <span
          className="ml-1 h-7 w-7 rounded-full border border-[var(--line)]"
          style={{ background: value || "var(--accent)" }}
        />
      </div>
      {inheritLabel && (
        <label className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
          <input type="checkbox" checked={inherit} onChange={(e) => setInherit(e.target.checked)} />
          {inheritLabel}
        </label>
      )}
    </div>
  );
}

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

      <section className="space-y-4 rounded-2xl border border-[var(--line)] p-5">
        <div>
          <h3 className="text-sm font-semibold">Màu giao diện</h3>
          <p className="mt-1 text-xs text-fg-faint">
            Accent đổi màu nút, link, highlight. Màu chữ tiếng Anh áp dụng cho mọi dòng EN.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField name="accent" label="Màu accent (tone chính)" defaultValue={profile.accent} />
          <ColorField
            name="enColor"
            label="Màu chữ tiếng Anh"
            defaultValue={profile.enColor}
            inheritLabel="Dùng cùng màu accent"
          />
        </div>
        <Select
          label="Tỉ lệ ảnh mặc định (mục 01 — Dự án tiêu biểu)"
          name="cardAspect"
          defaultValue={profile.cardAspect || "16/11"}
          options={[
            { value: "16/11", label: "16:11 (mặc định)" },
            { value: "16/9", label: "16:9 (rộng)" },
            { value: "4/3", label: "4:3" },
            { value: "1/1", label: "1:1 (vuông)" },
            { value: "3/4", label: "3:4 (dọc)" },
          ]}
          hint="Áp dụng cho các card chưa đặt tỉ lệ riêng."
        />
        <Select
          label="Tỉ lệ khung avatar (trang Home)"
          name="avatarAspect"
          defaultValue={profile.avatarAspect || "4/5"}
          options={[
            { value: "4/5", label: "4:5 (dọc, mặc định)" },
            { value: "3/4", label: "3:4 (dọc cao)" },
            { value: "1/1", label: "1:1 (vuông)" },
            { value: "4/3", label: "4:3 (ngang)" },
            { value: "16/9", label: "16:9 (ngang rộng)" },
          ]}
          hint="Chỉ đổi khung ảnh đại diện ở Hero trang chủ — không ảnh hưởng card dự án."
        />
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
