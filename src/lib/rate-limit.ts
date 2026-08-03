import "server-only";

/**
 * Giới hạn số lần thử đăng nhập, chống dò mật khẩu.
 *
 * Bộ đếm nằm trong bộ nhớ tiến trình. Trên serverless mỗi instance giữ bộ đếm
 * riêng, nên đây KHÔNG phải giới hạn toàn cục — kẻ tấn công phân tán qua nhiều
 * instance vẫn được nhiều lượt hơn con số cấu hình. Nhưng nó chặn đứng kiểu tấn
 * công phổ biến nhất (dò liên tục từ một nguồn) mà không cần thêm hạ tầng.
 * Muốn giới hạn thật sự toàn cục thì chuyển bộ đếm này sang Redis/Upstash.
 */

type Bucket = { count: number; resetAt: number; blockedUntil: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // cửa sổ 15 phút
const MAX_ATTEMPTS = 8;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_KEYS = 5000;

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, b] of buckets) {
    if (b.resetAt < now && b.blockedUntil < now) buckets.delete(k);
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

/** Ghi nhận một lần thử. Gọi TRƯỚC khi kiểm tra thông tin đăng nhập. */
export function hitLoginAttempt(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let b = buckets.get(key);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + WINDOW_MS, blockedUntil: 0 };
    buckets.set(key, b);
  }

  if (b.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((b.blockedUntil - now) / 1000) };
  }

  b.count += 1;
  if (b.count > MAX_ATTEMPTS) {
    b.blockedUntil = now + BLOCK_MS;
    return { allowed: false, retryAfterSec: Math.ceil(BLOCK_MS / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Xóa bộ đếm sau khi đăng nhập thành công. */
export function resetLoginAttempts(key: string) {
  buckets.delete(key);
}
