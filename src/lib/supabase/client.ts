import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client, for use inside "use client" components
 * (e.g. admin panel forms). Reads the two public env vars — safe to
 * expose client-side, access is governed by Row Level Security, not by
 * keeping this key secret. See README/setup notes for where these vars
 * come from.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
