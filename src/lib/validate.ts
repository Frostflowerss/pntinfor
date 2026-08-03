import "server-only";
import { z } from "zod";

/**
 * Kiểm tra dữ liệu ở biên server action.
 *
 * Trước đây các action dựng thẳng row từ String(formData.get(k)) — không schema,
 * không giới hạn độ dài, không kiểm kiểu. Hệ quả cụ thể: `percent` nhận số âm,
 * 1e9 hay NaN rồi đổ thẳng vào độ rộng thanh kĩ năng ở /about; `level` là chuỗi
 * tự do không đối chiếu 4 giá trị hợp lệ; `email` không kiểm; mảng ảnh sau
 * JSON.parse không kiểm kiểu trước khi ghi vào DB.
 *
 * Các helper dưới đây "làm sạch chứ không ném lỗi": admin đang gõ dở không nên
 * bị chặn bởi lỗi validate, nhưng dữ liệu bẩn thì không được lọt xuống DB.
 */

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Skillful", "Expert"] as const;

const hex = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

/** Số nguyên trong khoảng, tự cắt biên. NaN/rỗng -> giá trị mặc định. */
export function intInRange(input: unknown, min: number, max: number, fallback: number): number {
  const n = Number(input);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function skillLevel(input: unknown): (typeof SKILL_LEVELS)[number] {
  const r = z.enum(SKILL_LEVELS).safeParse(input);
  return r.success ? r.data : "Skillful";
}

/** Trả về email hợp lệ, hoặc chuỗi rỗng (trường này vốn không bắt buộc). */
export function email(input: unknown): string {
  const r = z.string().trim().email().max(320).safeParse(input);
  return r.success ? r.data : "";
}

/** Màu hex hợp lệ, ngược lại dùng fallback. */
export function hexColor(input: unknown, fallback: string): string {
  const r = hex.safeParse(typeof input === "string" ? input.trim() : input);
  return r.success ? r.data : fallback;
}

/** Giới hạn độ dài text để một POST không nhét được cả cuốn sách vào DB. */
export function text(input: unknown, max = 5000): string {
  return String(input ?? "").slice(0, max);
}

/** Parse chuỗi JSON thành mảng URL string; hỏng hoặc sai kiểu -> mảng rỗng. */
export function urlList(input: unknown): string[] {
  try {
    const parsed = JSON.parse(String(input ?? "[]"));
    const r = z.array(z.string().max(2048)).max(200).safeParse(parsed);
    return r.success ? r.data.filter(Boolean) : [];
  } catch {
    return [];
  }
}
