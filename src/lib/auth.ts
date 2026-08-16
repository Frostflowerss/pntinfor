import "server-only";
import { cookies, headers } from "next/headers";
import crypto from "crypto";

const COOKIE = "pnt_admin";
const MAX_AGE = 60 * 60 * 8; // 8h
const MIN_SECRET = 32;

/** Session secret must be set explicitly (≥ 32 chars). No silent fallbacks. */
function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  if (s.length >= MIN_SECRET) return s;
  if (process.env.NODE_ENV !== "production" && s.length > 0) return s.padEnd(MIN_SECRET, "0");
  return null;
}

export const isAuthConfigured = Boolean(
  secret() && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD
);

function sign(payload: string, key: string) {
  return crypto.createHmac("sha256", key).update(payload).digest("hex");
}

function makeToken(key: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${nonce}.${exp}`;
  return `${payload}.${sign(payload, key)}`;
}

function verifyToken(token: string | undefined): boolean {
  const key = secret();
  if (!token || !key) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [nonce, exp, sig] = parts;
  const expected = sign(`${nonce}.${exp}`, key);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(exp) > Date.now();
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare against a same-length buffer so timing doesn't leak the length.
  const same = ab.length === bb.length;
  return crypto.timingSafeEqual(ab, same ? bb : Buffer.alloc(ab.length)) && same;
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p || !secret()) return false;
  return safeEqual(username, u) && safeEqual(password, p);
}

/* ---------------- Login rate limit (per IP, in-memory) ----------------
   5 failed attempts → 15 min lock. Good enough for a single-admin site on
   one region; for multi-region/serverless swap the Map for Upstash Redis. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const attempts = new Map<string, { n: number; at: number }>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

export function isLocked(ip: string): number {
  const rec = attempts.get(ip);
  if (!rec) return 0;
  if (Date.now() - rec.at > WINDOW_MS) {
    attempts.delete(ip);
    return 0;
  }
  return rec.n >= MAX_FAILS ? Math.ceil((WINDOW_MS - (Date.now() - rec.at)) / 60000) : 0;
}

export function recordFailure(ip: string) {
  const rec = attempts.get(ip);
  if (!rec || Date.now() - rec.at > WINDOW_MS) attempts.set(ip, { n: 1, at: Date.now() });
  else rec.n += 1;
  // keep the map small
  if (attempts.size > 500) {
    const cutoff = Date.now() - WINDOW_MS;
    for (const [k, v] of attempts) if (v.at < cutoff) attempts.delete(k);
  }
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}

export async function createSession() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const store = await cookies();
  store.set(COOKIE, makeToken(key), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
