/**
 * Structural nav — not admin-editable per CLAUDE.md's spec (only content
 * is), so this stays a plain constant rather than a table.
 *
 * Deliberately its own file, not part of site.ts (which also exports
 * Supabase-backed server functions like getSiteSettings/getContactInfo).
 * Header/Footer/MobileNav are Client Components mounted on every single
 * page, and a plain `import { nav } from "@/lib/data/site"` — even
 * though `nav` itself has no Supabase dependency — pulls in that whole
 * module's static import graph, including its `createClient()` import
 * from @supabase/supabase-js. That shipped the entire Supabase client
 * library to the browser bundle on every page for zero reason (public
 * data fetching is 100% server-side; confirmed via bundle inspection —
 * one shared chunk was ~85% unused JS on the homepage, and grepping it
 * turned up dozens of @supabase references). Splitting this constant
 * out removes that import path entirely.
 */
export const nav = [
  { label: "Marketing Work", href: "/marketing" },
  { label: "Engineering", href: "/engineering" },
  { label: "About", href: "/about" },
] as const;
