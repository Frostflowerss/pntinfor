import "server-only";
import { z } from "zod";
import { SKILL_LEVELS, type SkillLevel } from "./types";

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

const hex = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

/** Số nguyên trong khoảng, tự cắt biên. NaN/rỗng -> giá trị mặc định. */
export function intInRange(input: unknown, min: number, max: number, fallback: number): number {
  const n = Number(input);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function skillLevel(input: unknown): SkillLevel {
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

export type ImageEntry = { url: string; width: number | null; height: number | null };

const dimension = z.number().int().positive().max(30000).nullable().catch(null);

/**
 * Parse danh sách ảnh của dự án.
 *
 * Chấp nhận cả hai dạng: mảng chuỗi URL (dữ liệu lưu trước khi có cột
 * width/height) và mảng object {url,width,height} (dạng mới). Ảnh cũ giữ
 * width/height = null, giao diện tự quay về cách hiển thị cũ cho chúng.
 */
export function imageList(input: unknown): ImageEntry[] {
  try {
    const parsed = JSON.parse(String(input ?? "[]"));
    const schema = z
      .array(
        z.union([
          z.string().max(2048),
          z.object({
            url: z.string().max(2048),
            width: dimension.optional(),
            height: dimension.optional(),
          }),
        ])
      )
      .max(200);
    const r = schema.safeParse(parsed);
    if (!r.success) return [];
    return r.data
      .map((e) =>
        typeof e === "string"
          ? { url: e, width: null, height: null }
          : { url: e.url, width: e.width ?? null, height: e.height ?? null }
      )
      .filter((e) => Boolean(e.url));
  } catch {
    return [];
  }
}
