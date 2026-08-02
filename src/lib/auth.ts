import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "pnt_admin";
const MAX_AGE = 60 * 60 * 8; // 8h

/**
 * Khóa ký cookie phiên. Fail-closed: KHÔNG có giá trị mặc định.
 *
 * Trước đây hàm này fallback về một chuỗi hằng công khai, nghĩa là bất kỳ ai
 * đọc source cũng tự ký được cookie hợp lệ và vào thẳng /pntarch mà không cần
 * qua checkCredentials. Nay thiếu biến môi trường thì ném lỗi thay vì mở cửa.
 *
 * Cũng không tái dùng SUPABASE_SERVICE_ROLE_KEY làm khóa HMAC nữa: sai mục
 * đích khóa, và xoay khóa Supabase sẽ vô hiệu hóa mọi phiên đăng nhập.
 */
function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET chưa được cấu hình (hoặc ngắn hơn 32 ký tự). " +
        "Sinh khóa mới bằng: openssl rand -hex 32"
    );
  }
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function makeToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `pntarch.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [a, exp, sig] = parts;
    const payload = `${a}.${exp}`;
    const expected = sign(payload);
    // So sánh theo số BYTE, không theo String.length: một cookie chứa ký tự
    // nhiều byte có thể vượt qua guard độ dài rồi làm timingSafeEqual ném lỗi.
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;
    if (Number(exp) < Date.now()) return false;
    return true;
  } catch {
    // Thiếu ADMIN_SESSION_SECRET hoặc cookie dị dạng → từ chối, không sập.
    return false;
  }
}

/**
 * So sánh chuỗi theo thời gian hằng định, an toàn với UTF-8.
 *
 * Cách cũ so `String.length` (đơn vị UTF-16) rồi mới đưa vào `Buffer.from()`
 * (byte UTF-8). Một username như "é" dài 1 ký tự nhưng 2 byte sẽ lọt qua guard
 * độ dài rồi làm `timingSafeEqual` ném RangeError — lỗi 500 thay vì "sai mật
 * khẩu". Băm cả hai vế trước: SHA-256 luôn cho 32 byte nên phép so sánh không
 * bao giờ lệch độ dài, và độ dài chuỗi gốc cũng không bị rò qua thời gian chạy.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p) return false;
  // Luôn chạy cả hai phép so sánh, không short-circuit, để thời gian phản hồi
  // không tiết lộ việc username đúng hay sai.
  const uOk = safeEqual(username, u);
  const pOk = safeEqual(password, p);
  return uOk && pOk;
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE, makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}
