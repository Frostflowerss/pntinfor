/**
 * Studio upload pipeline (browser side).
 *
 * 1. optimizeImage — resize to ≤ maxDim and re-encode as WebP before upload.
 *    A 6 MB phone photo becomes ~300–600 KB; the site loads faster and the
 *    Supabase bucket stays small. GIF/SVG and already-small files pass through.
 * 2. uploadFiles — parallel (concurrency 3) with per-file progress.
 */

export type OptimizeOptions = {
  maxDim?: number; // longest edge, px
  quality?: number; // 0..1
  /** skip re-encoding when the file is already below this size AND within maxDim */
  skipBelowBytes?: number;
};

const DEFAULTS: Required<OptimizeOptions> = { maxDim: 2400, quality: 0.84, skipBelowBytes: 350 * 1024 };

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      // imageOrientation honours EXIF rotation from phones.
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall through */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode failed"));
    };
    img.src = url;
  });
}

export async function optimizeImage(file: File, opts: OptimizeOptions = {}): Promise<File> {
  const o = { ...DEFAULTS, ...opts };
  if (!file.type.startsWith("image/") || /gif|svg/.test(file.type)) return file;

  let src: ImageBitmap | HTMLImageElement;
  try {
    src = await decode(file);
  } catch {
    return file;
  }
  const w = "width" in src ? src.width : 0;
  const h = "height" in src ? src.height : 0;
  if (!w || !h) return file;

  const scale = Math.min(1, o.maxDim / Math.max(w, h));
  const alreadyWebp = file.type === "image/webp";
  if (scale === 1 && alreadyWebp && file.size <= o.skipBelowBytes) return file;

  const cw = Math.round(w * scale);
  const ch = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, cw, ch);
  if ("close" in src) src.close();

  const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/webp", o.quality));
  if (!blob) return file;
  // Only keep the re-encode if it actually helped (or we had to downscale).
  if (scale === 1 && blob.size >= file.size) return file;
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
}

export type UploadResult = { url: string; path: string; bytes: number };

export async function uploadOne(file: File, folder: string): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Upload thất bại (${res.status})`);
  return json as UploadResult;
}

export type UploadProgress = { done: number; total: number; current?: string; savedBytes: number };

/** Optimize + upload many files, 3 at a time, preserving input order in the result. */
export async function uploadFiles(
  files: File[],
  folder: string,
  onProgress?: (p: UploadProgress) => void,
  optimize = true
): Promise<UploadResult[]> {
  const results: UploadResult[] = new Array(files.length);
  let done = 0;
  let savedBytes = 0;
  let cursor = 0;
  const total = files.length;

  async function worker() {
    while (cursor < total) {
      const i = cursor++;
      const original = files[i];
      onProgress?.({ done, total, current: original.name, savedBytes });
      const file = optimize ? await optimizeImage(original) : original;
      savedBytes += Math.max(0, original.size - file.size);
      results[i] = await uploadOne(file, folder);
      done++;
      onProgress?.({ done, total, current: original.name, savedBytes });
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, total) }, worker));
  return results;
}

export function readOrientation(url: string): Promise<"vertical" | "horizontal"> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.height > img.width ? "vertical" : "horizontal");
    img.onerror = () => resolve("horizontal");
    img.src = url;
  });
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
