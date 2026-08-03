import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthed } from "@/lib/auth";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

/** MIME đã duyệt -> đuôi file. Đuôi LUÔN suy từ đây, không lấy từ tên file. */
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

/** Chữ ký byte đầu tệp, để không tin lời khai Content-Type của client. */
const MAGIC: Record<string, (b: Buffer) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  "image/gif": (b) => b.subarray(0, 6).toString("ascii").startsWith("GIF8"),
  "image/webp": (b) =>
    b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  "image/avif": (b) => b.subarray(4, 8).toString("ascii") === "ftyp",
  "application/pdf": (b) => b.subarray(0, 5).toString("ascii") === "%PDF-",
};

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

  // Chặn theo Content-Length TRƯỚC khi đọc body. req.formData() nạp toàn bộ
  // multipart vào RAM, nên kiểm tra kích thước sau khi parse là đã muộn — một
  // POST rất lớn có thể làm cạn bộ nhớ trước khi tới được dòng kiểm tra.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_PDF + 1024 * 1024) {
    return NextResponse.json({ error: "Tệp quá lớn." }, { status: 413 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "gallery");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "gallery";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Không có tệp." }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Định dạng không hỗ trợ." }, { status: 400 });
  }

  const isPdf = file.type === "application/pdf";
  const limit = isPdf ? MAX_PDF : MAX_IMAGE;
  if (file.size > limit) {
    return NextResponse.json(
      { error: isPdf ? "PDF vượt quá 25MB." : "Ảnh vượt quá 12MB." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // file.type do trình duyệt khai, sửa được tùy ý. Đối chiếu byte đầu tệp để
  // không lưu nội dung bất kỳ vào bucket công khai dưới mác image/*.
  if (!MAGIC[file.type]?.(buffer)) {
    return NextResponse.json(
      { error: "Nội dung tệp không khớp với định dạng khai báo." },
      { status: 400 }
    );
  }

  // Đuôi lấy từ MIME đã duyệt, KHÔNG từ file.name. Tên như "a.png/../../x.html"
  // trước đây lọt thẳng vào khóa lưu trữ và thoát khỏi allowlist thư mục.
  const path = `${folder}/${randomUUID()}.${ext}`;

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
