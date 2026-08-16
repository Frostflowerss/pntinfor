import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthed } from "@/lib/auth";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_IMAGE = 12 * 1024 * 1024; // 12MB (client compresses to ~≤1MB before sending)
const MAX_PDF = 25 * 1024 * 1024; // 25MB
const FOLDERS = new Set(["avatar", "cv", "projects", "gallery"]);

/**
 * Sniff the real file type from magic bytes — never trust the client's MIME or extension.
 * Returns { mime, ext } or null when the bytes don't match an allowed type.
 */
function sniff(buf: Buffer): { mime: string; ext: string } | null {
  const b = buf.subarray(0, 16);
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { mime: "image/png", ext: "png" };
  if (b.length >= 6 && (b.subarray(0, 6).toString("ascii") === "GIF87a" || b.subarray(0, 6).toString("ascii") === "GIF89a"))
    return { mime: "image/gif", ext: "gif" };
  if (b.length >= 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP")
    return { mime: "image/webp", ext: "webp" };
  if (b.length >= 12 && b.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = b.subarray(8, 12).toString("ascii");
    if (brand.startsWith("avif") || brand.startsWith("avis")) return { mime: "image/avif", ext: "avif" };
  }
  if (b.length >= 5 && b.subarray(0, 5).toString("ascii") === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  return null;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "gallery");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "gallery";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Không có tệp." }, { status: 400 });
  }
  if (file.size > Math.max(MAX_IMAGE, MAX_PDF)) {
    return NextResponse.json({ error: "Tệp quá lớn." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buffer);
  if (!kind) {
    return NextResponse.json({ error: "Định dạng không hỗ trợ (JPG, PNG, WebP, AVIF, GIF, PDF)." }, { status: 415 });
  }
  const isPdf = kind.mime === "application/pdf";
  if (isPdf && folder !== "cv") {
    return NextResponse.json({ error: "PDF chỉ dùng cho mục CV." }, { status: 400 });
  }
  if (!isPdf && buffer.length > MAX_IMAGE) {
    return NextResponse.json({ error: "Ảnh vượt quá 12MB." }, { status: 413 });
  }
  if (isPdf && buffer.length > MAX_PDF) {
    return NextResponse.json({ error: "PDF vượt quá 25MB." }, { status: 413 });
  }

  const path = `${folder}/${randomUUID()}.${kind.ext}`;
  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, buffer, {
    contentType: kind.mime,
    cacheControl: "31536000", // immutable: file names are UUIDs
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path, bytes: buffer.length, mime: kind.mime });
}
