import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Plain (non-cookie-bound) Supabase client for public content reads —
 * used by everything in src/lib/data/*.ts. Public pages never reflect a
 * visitor's own auth state (only /admin does), and some of these reads
 * happen at build time (generateStaticParams/generateMetadata for the
 * statically-generated case-study/project routes), where Next.js's
 * cookies()-bound server client isn't available at all — there's no
 * request to bind to yet. One plain client sidesteps that entirely and
 * keeps every public data function usable in both contexts.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
