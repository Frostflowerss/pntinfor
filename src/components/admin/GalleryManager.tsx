"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  X,
  RectangleHorizontal,
  RectangleVertical,
  GripVertical,
  Check,
  Sparkles,
} from "lucide-react";
import { addGalleryImages, deleteGalleryImage, updateGalleryImage, reorderGallery } from "@/lib/actions";
import { fmtBytes, readOrientation, uploadFiles, type UploadProgress } from "@/lib/client-image";
import type { GalleryImage } from "@/lib/types";

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const [order, setOrder] = useState<string[]>(images.map((g) => g.id));
  const [dirty, setDirty] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // keep local order in sync when server data changes (after refresh)
  const known = new Set(images.map((g) => g.id));
  const ordered = [
    ...order.filter((id) => known.has(id)).map((id) => images.find((g) => g.id === id)!),
    ...images.filter((g) => !order.includes(g.id)),
  ];

  async function onFiles(files: FileList | null) {
    const list = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (!list.length) return;
    setBusy(true);
    setErr("");
    try {
      const results = await uploadFiles(list, "gallery", setProgress);
      const items = await Promise.all(
        results.map(async (r, i) => ({
          url: r.url,
          orientation: await readOrientation(r.url),
          alt: list[i].name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        }))
      );
      await addGalleryImages(items);
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(null), 2500);
    }
  }

  function move(from: number, to: number) {
    setOrder(() => {
      const ids = ordered.map((g) => g.id);
      const [m] = ids.splice(from, 1);
      ids.splice(to, 0, m);
      return ids;
    });
    setDirty(true);
  }

  const pct = progress?.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Thư viện</h2>
          <p className="text-sm text-fg-faint">{images.length} ảnh · kéo–thả để sắp xếp · bấm vào chú thích để sửa</p>
        </div>
        {dirty && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await reorderGallery(ordered.map((g) => g.id));
                setDirty(false);
                router.refresh();
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Lưu thứ tự
          </button>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragIndex.current === null) onFiles(e.dataTransfer.files);
        }}
        className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--ink-soft)]/40 py-12 transition hover:border-accent"
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-2 px-6 text-fg-faint">
          {busy ? <Loader2 className="animate-spin" /> : <UploadCloud size={26} />}
          <span className="text-sm">
            {busy ? `Đang tối ưu & tải lên… ${progress?.done ?? 0}/${progress?.total ?? 0}` : "Kéo–thả hoặc bấm để tải nhiều ảnh"}
          </span>
          {progress && (
            <div className="mt-1 w-full">
              <div className="h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]">
                <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
              </div>
              {progress.savedBytes > 0 && (
                <p className="mt-1 flex items-center justify-center gap-1 text-[11px]">
                  <Sparkles size={11} className="text-accent" /> tiết kiệm {fmtBytes(progress.savedBytes)}
                </p>
              )}
            </div>
          )}
          {!busy && <span className="text-[11px]">Ảnh được tự nén (WebP, ≤ 2400px) trước khi tải lên</span>}
        </div>
      </div>
      {err && <p className="text-sm text-red-400">{err}</p>}

      {ordered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.map((g, i) => (
            <GalleryTile
              key={g.id}
              g={g}
              index={i}
              pending={pending}
              onDragStart={() => (dragIndex.current = i)}
              onDragEnd={() => (dragIndex.current = null)}
              onDropOn={() => {
                if (dragIndex.current !== null && dragIndex.current !== i) move(dragIndex.current, i);
                dragIndex.current = null;
              }}
              onToggle={() =>
                start(async () => {
                  await updateGalleryImage(g.id, {
                    orientation: g.orientation === "vertical" ? "horizontal" : "vertical",
                  });
                  router.refresh();
                })
              }
              onAlt={(alt) =>
                start(async () => {
                  await updateGalleryImage(g.id, { alt });
                  router.refresh();
                })
              }
              onDelete={() => {
                if (!confirm("Xóa ảnh này? File trong Storage cũng sẽ bị xóa.")) return;
                start(async () => {
                  await deleteGalleryImage(g.id);
                  router.refresh();
                });
              }}
            />
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </div>
  );
}

function GalleryTile({
  g,
  index,
  pending,
  onDragStart,
  onDragEnd,
  onDropOn,
  onToggle,
  onAlt,
  onDelete,
}: {
  g: GalleryImage;
  index: number;
  pending: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOn: () => void;
  onToggle: () => void;
  onAlt: (alt: string) => void;
  onDelete: () => void;
}) {
  const [alt, setAlt] = useState(g.alt);
  const [editing, setEditing] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.stopPropagation();
        onDropOn();
      }}
      className="group relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--ink-soft)]"
    >
      <div className={g.orientation === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]"}>
        <Image src={g.url} alt={g.alt} width={480} height={g.orientation === "vertical" ? 640 : 360} className="h-full w-full object-cover" sizes="300px" />
      </div>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2 opacity-0 transition group-hover:opacity-100">
        <span className="grid h-7 w-7 cursor-grab place-items-center rounded-lg bg-black/60 text-white">
          <GripVertical size={14} />
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onToggle}
            disabled={pending}
            title={g.orientation === "vertical" ? "Đổi sang ngang" : "Đổi sang dọc"}
            className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white hover:bg-black/80"
          >
            {g.orientation === "vertical" ? <RectangleVertical size={14} /> : <RectangleHorizontal size={14} />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-red-500/80"
            aria-label="Xóa ảnh"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span className="font-mono text-[10px] text-fg-faint">{String(index + 1).padStart(2, "0")}</span>
        {editing ? (
          <input
            autoFocus
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => {
              setEditing(false);
              if (alt !== g.alt) onAlt(alt);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") {
                setAlt(g.alt);
                setEditing(false);
              }
            }}
            placeholder="Chú thích / alt"
            className="w-full bg-transparent text-xs outline-none placeholder:text-fg-faint"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="w-full truncate text-left text-xs text-fg-muted hover:text-fg"
            title="Sửa chú thích (alt) — tốt cho SEO & trợ năng"
          >
            {g.alt || <span className="text-fg-faint">Thêm chú thích…</span>}
          </button>
        )}
      </div>
    </div>
  );
}
