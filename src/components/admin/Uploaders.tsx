"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, FileText, GripVertical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtBytes, uploadFiles, uploadOne, type UploadProgress } from "@/lib/client-image";

function ProgressLine({ p }: { p: UploadProgress | null }) {
  if (!p) return null;
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
  return (
    <div className="mt-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]">
        <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-fg-faint">
        {p.done}/{p.total}
        {p.savedBytes > 0 && (
          <>
            <Sparkles size={11} className="text-accent" /> tiết kiệm {fmtBytes(p.savedBytes)}
          </>
        )}
      </p>
    </div>
  );
}

/* ---------------- Single image ---------------- */
export function ImageUploader({
  name,
  folder,
  initialUrl,
  label = "Ảnh",
  aspect = "aspect-[4/3]",
  maxDim,
}: {
  name: string;
  folder: string;
  initialUrl?: string;
  label?: string;
  aspect?: string;
  /** override longest edge (e.g. 1200 for avatars) */
  maxDim?: number;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    async (file?: File) => {
      if (!file) return;
      setBusy(true);
      setErr("");
      setNote("");
      try {
        const { optimizeImage } = await import("@/lib/client-image");
        const optimized = await optimizeImage(file, maxDim ? { maxDim } : {});
        const res = await uploadOne(optimized, folder);
        setUrl(res.url);
        if (optimized.size < file.size)
          setNote(`${fmtBytes(file.size)} → ${fmtBytes(optimized.size)}`);
      } catch (e) {
        setErr((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [folder, maxDim]
  );

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-fg-muted">{label}</span>
      <input type="hidden" name={name} value={url} readOnly />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative grid cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-[var(--line)] bg-[var(--ink-soft)] transition hover:border-accent",
          aspect
        )}
      >
        {url ? (
          <>
            <Image src={url} alt="" fill className="object-cover" sizes="400px" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUrl("");
                setNote("");
              }}
              className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Gỡ ảnh"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center text-fg-faint">
            {busy ? <Loader2 className="animate-spin" /> : <UploadCloud />}
            <span className="text-xs">{busy ? "Đang tối ưu & tải lên…" : "Kéo thả hoặc bấm để chọn ảnh"}</span>
          </div>
        )}
      </div>
      {note && <p className="mt-1 text-[11px] text-fg-faint">Đã nén: {note}</p>}
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handle(e.target.files?.[0] ?? undefined);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- PDF (CV) ---------------- */
export function PdfUploader({
  name,
  folder = "cv",
  initialUrl,
  label = "CV (PDF)",
}: {
  name: string;
  folder?: string;
  initialUrl?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const res = await uploadOne(file, folder);
      setUrl(res.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-fg-muted">{label}</span>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-4 py-2.5 text-sm transition hover:border-accent"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
          {url ? "Thay PDF" : "Chọn PDF"}
        </button>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="truncate text-xs text-accent">
            Xem file hiện tại
          </a>
        )}
        {url && (
          <button type="button" onClick={() => setUrl("")} className="text-fg-faint hover:text-red-400" aria-label="Gỡ PDF">
            <X size={16} />
          </button>
        )}
      </div>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(e) => {
          handle(e.target.files?.[0] ?? undefined);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- Multi image (project detail) ---------------- */
export function MultiImageUploader({
  name,
  folder,
  initial = [],
}: {
  name: string;
  folder: string;
  initial?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  async function handleFiles(files: FileList | File[] | null) {
    const list = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (!list.length) return;
    setBusy(true);
    setErr("");
    try {
      const results = await uploadFiles(list, folder, setProgress);
      setUrls((p) => [...p, ...results.map((r) => r.url)]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(null), 2500);
    }
  }

  function remove(i: number) {
    setUrls((p) => p.filter((_, idx) => idx !== i));
  }

  function reorder(from: number, to: number) {
    setUrls((p) => {
      const copy = [...p];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return copy;
    });
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        // Files dropped anywhere on the block are uploaded; tile-drag is handled per tile.
        if (e.dataTransfer.files?.length && dragIndex.current === null) {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }
      }}
    >
      <span className="mb-1.5 block text-xs font-medium text-fg-muted">
        Ảnh chi tiết dự án ({urls.length})
      </span>
      <input type="hidden" name={name} value={JSON.stringify(urls)} readOnly />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((u, i) => (
          <div
            key={u + i}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragEnd={() => (dragIndex.current = null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.stopPropagation();
              if (dragIndex.current !== null && dragIndex.current !== i) reorder(dragIndex.current, i);
              dragIndex.current = null;
            }}
            className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--line)]"
          >
            <Image src={u} alt="" fill className="object-cover" sizes="200px" />
            <div className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
              <GripVertical size={13} />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
              aria-label={`Gỡ ảnh ${i + 1}`}
            >
              <X size={13} />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 font-mono text-[9px] text-white">
              {i + 1}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="grid aspect-square place-items-center rounded-lg border border-dashed border-[var(--line)] bg-[var(--ink-soft)] text-fg-faint transition hover:border-accent disabled:opacity-60"
          aria-label="Thêm ảnh"
        >
          {busy ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
        </button>
      </div>
      <ProgressLine p={progress} />
      <p className="mt-2 text-[11px] text-fg-faint">
        Kéo–thả thumbnail để sắp xếp. Chọn hoặc thả nhiều ảnh cùng lúc — ảnh được tự nén (WebP, ≤ 2400px) trước khi tải lên.
      </p>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
