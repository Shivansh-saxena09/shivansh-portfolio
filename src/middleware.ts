import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Scoped to /admin only. This calls supabase.auth.getUser(), which is
    // a real network round-trip to Supabase's Auth server — worth paying
    // on admin routes (the only place auth state matters), but it was
    // previously matching every public route too (the "everything except
    // static assets" pattern), adding that same round-trip latency to
    // every single visitor's every page load and navigation site-wide
    // for zero benefit, since public pages never check auth state.
    "/admin/:path*",
  ],
};
