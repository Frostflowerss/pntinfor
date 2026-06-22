import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthed } from "@/lib/auth";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_IMAGE = 12 * 1024 * 1024; // 12MB
const MAX_PDF = 25 * 1024 * 1024; // 25MB

const FOLDERS = new Set(["avatar", "cv", "projects", "gallery", "home"]);

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase service role key chưa được cấu hình." },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "gallery");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "gallery";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Không có tệp." }, { status: 400 });
  }

  const isPdf = file.type === "application/pdf";
  const isImage = IMAGE_TYPES.includes(file.type);
  if (!isPdf && !isImage) {
    return NextResponse.json({ error: "Định dạng không hỗ trợ." }, { status: 400 });
  }
  if (isImage && file.size > MAX_IMAGE) {
    return NextResponse.json({ error: "Ảnh vượt quá 12MB." }, { status: 400 });
  }
  if (isPdf && file.size > MAX_PDF) {
    return NextResponse.json({ error: "PDF vượt quá 25MB." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || (isPdf ? "pdf" : "jpg")).toLowerCase();
  const path = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
