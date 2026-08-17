import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when public env vars are present — pages can read from Supabase. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** True when the service role key is present — admin can write. (server only) */
export const isAdminConfigured = Boolean(url && serviceKey);

export const STORAGE_BUCKET = "portfolio";

/* Clients are stateless here (no session persistence), so one instance per
   process is reused instead of rebuilt on every call. */
let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/** Read-only client (anon key). Safe for browser and server reads. */
export function getPublicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  publicClient ??= createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return publicClient;
}

/**
 * Privileged client (service role). SERVER-ONLY.
 * Never import this into a Client Component. Used by admin API routes
 * after the admin session cookie has been verified.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  adminClient ??= createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
