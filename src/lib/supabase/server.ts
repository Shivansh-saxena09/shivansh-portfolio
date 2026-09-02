import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client — for Server Components, Server Actions,
 * and Route Handlers. Reads/writes the auth session via Next.js's
 * cookie store, per @supabase/ssr's Next.js App Router pattern. Public
 * pages use this (with the anon key) to fetch published content;
 * RLS policies decide what an unauthenticated request can see.
 *
 * Must be created fresh per request (never module-level) since it's
 * bound to that request's cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (not a Server Action/Route
            // Handler) — cookies can't be written here. Harmless as long
            // as middleware.ts is also refreshing the session.
          }
        },
      },
    },
  );
}
