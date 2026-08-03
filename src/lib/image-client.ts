/**
 * Tiện ích xử lý ảnh phía trình duyệt (chỉ dùng trong client component).
 *
 * Hai việc:
 *  1. Đọc kích thước gốc để lưu vào DB — giao diện hết phải đoán tỉ lệ.
 *  2. Thu nhỏ ảnh quá lớn trước khi tải lên. Ảnh render kiến trúc thường
 *     10–20MB, vượt giới hạn 12MB của API và làm người dùng chờ rất lâu, trong
 *     khi hiển thị trên web chẳng bao giờ cần quá 2560px.
 */

export type ImageSize = { width: number; height: number };

/** Đọc kích thước gốc của ảnh. Trả về null nếu trình duyệt không giải mã được. */
export async function readImageSize(file: File): Promise<ImageSize | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const MAX_EDGE = 2560;
const COMPRESS_ABOVE = 2 * 1024 * 1024; // chỉ đụng vào ảnh trên 2MB

/**
 * Thu nhỏ ảnh nếu cạnh dài vượt MAX_EDGE hoặc tệp quá nặng.
 * Trả về tệp gốc nếu không cần đụng tới, hoặc nếu nén xong lại to hơn.
 * GIF được bỏ qua để không làm mất ảnh động.
 */
export async function compressImage(
  file: File
): Promise<{ file: File; size: ImageSize | null }> {
  const size = await readImageSize(file);

  const tooBig = file.size > COMPRESS_ABOVE;
  const tooWide = size ? Math.max(size.width, size.height) > MAX_EDGE : false;
  if (file.type === "image/gif" || !size || (!tooBig && !tooWide)) {
    return { file, size };
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(size.width, size.height));
    const w = Math.round(size.width * scale);
    const h = Math.round(size.height * scale);

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, size };
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/webp", 0.86)
    );
    if (!blob || blob.size >= file.size) return { file, size };

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return {
      file: new File([blob], name, { type: "image/webp" }),
      size: { width: w, height: h },
    };
  } catch {
    // Nén là tối ưu, không phải điều kiện bắt buộc — hỏng thì gửi bản gốc.
    return { file, size };
  }
}
