import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "pnt_admin";
const MAX_AGE = 60 * 60 * 8; // 8h

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "pntarch-dev-secret-change-me"
  );
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
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [a, exp, sig] = parts;
  const payload = `${a}.${exp}`;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  if (Number(exp) < Date.now()) return false;
  return true;
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p) return false;
  const uOk =
    username.length === u.length &&
    crypto.timingSafeEqual(Buffer.from(username), Buffer.from(u));
  const pOk =
    password.length === p.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(p));
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
