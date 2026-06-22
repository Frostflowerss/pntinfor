"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent focus:ring-2 focus:ring-[var(--accent-soft)] placeholder:text-fg-faint";

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  lang,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  lang?: "vi" | "en";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-fg-muted">
        {label}
        {lang && <Tag lang={lang} />}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls}
      />
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
  lang,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  lang?: "vi" | "en";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-fg-muted">
        {label}
        {lang && <Tag lang={lang} />}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className={cn(inputCls, "resize-y leading-relaxed")}
      />
    </label>
  );
}

export function Tag({ lang }: { lang: "vi" | "en" }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
        lang === "vi" ? "bg-white/10 text-fg" : "bg-[var(--accent-soft)] text-accent"
      )}
    >
      {lang}
    </span>
  );
}

/** Bilingual input pair (VI + EN). */
export function BiField({
  label,
  base,
  vi,
  en,
  placeholder,
}: {
  label: string;
  base: string; // e.g. "title" → titleVI / titleEN
  vi?: string;
  en?: string;
  placeholder?: string;
}) {
  const cap = base.charAt(0).toUpperCase() + base.slice(1);
  return (
    <fieldset className="rounded-xl border border-[var(--line)] p-3">
      <legend className="px-1 text-xs font-semibold">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tiếng Việt" name={`${base}VI`} defaultValue={vi} placeholder={placeholder} lang="vi" />
        <Field label="English" name={`${base}EN`} defaultValue={en} placeholder={placeholder} lang="en" />
      </div>
      <input type="hidden" value={cap} readOnly hidden />
    </fieldset>
  );
}

export function BiArea({
  label,
  base,
  vi,
  en,
  rows = 3,
  hint,
}: {
  label: string;
  base: string;
  vi?: string;
  en?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <fieldset className="rounded-xl border border-[var(--line)] p-3">
      <legend className="px-1 text-xs font-semibold">{label}</legend>
      {hint && <p className="mb-2 px-1 text-[11px] text-fg-faint">{hint}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <Area label="Tiếng Việt" name={`${base}VI`} defaultValue={vi} rows={rows} lang="vi" />
        <Area label="English" name={`${base}EN`} defaultValue={en} rows={rows} lang="en" />
      </div>
    </fieldset>
  );
}

export function SubmitButton({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60",
        className
      )}
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {children ?? "Lưu"}
    </button>
  );
}
