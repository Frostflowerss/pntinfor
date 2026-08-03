"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, X, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { addGalleryImages, deleteGalleryImage, updateGalleryImage } from "@/lib/actions";
import { uploadImage } from "@/components/admin/Uploaders";
import type { GalleryImage } from "@/lib/types";

// Hàm upload trước đây được viết trùng ở đây và trong Uploaders.tsx; nay dùng
// chung một chỗ, kèm nén ảnh lớn và đo kích thước thật.

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    try {
      // Trước đây: tải tuần tự, rồi tải LẠI từng ảnh qua new Image() chỉ để
      // đoán dọc/ngang. Nay đo ngay từ tệp gốc trước khi gửi, và tải song song.
      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadImage(f, "gallery"))
      );
      const items = uploaded.map((u) => ({
        url: u.url,
        orientation: u.width && u.height && u.height > u.width ? "vertical" : "horizontal",
        width: u.width,
        height: u.height,
      }));
      await addGalleryImages(items);
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Thư viện</h2>
          <p className="text-sm text-fg-faint">{images.length} ảnh</p>
        </div>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--ink-soft)]/40 py-12 transition hover:border-accent"
      >
        <div className="flex flex-col items-center gap-2 text-fg-faint">
          {busy ? <Loader2 className="animate-spin" /> : <UploadCloud size={26} />}
          <span className="text-sm">{busy ? "Đang tải lên…" : "Kéo–thả hoặc bấm để tải nhiều ảnh"}</span>
        </div>
      </div>
      {err && <p className="text-sm text-red-400">{err}</p>}

      {images.length > 0 && (
        <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {images.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-xl border border-[var(--line)]">
              <Image
                src={g.url}
                alt={g.alt}
                width={400}
                height={g.orientation === "vertical" ? 560 : 300}
                className="h-auto w-full object-cover"
                sizes="300px"
              />
              <div className="absolute inset-0 flex items-start justify-between bg-black/40 p-2 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() =>
                    start(async () => {
                      await updateGalleryImage(g.id, g.orientation === "vertical" ? "horizontal" : "vertical");
                      router.refresh();
                    })
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white hover:bg-black/80"
                  title="Đổi hướng"
                  disabled={pending}
                >
                  {g.orientation === "vertical" ? <RectangleVertical size={15} /> : <RectangleHorizontal size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Xóa ảnh này?")) return;
                    start(async () => {
                      await deleteGalleryImage(g.id);
                      router.refresh();
                    });
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-red-500/80"
                  disabled={pending}
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}
