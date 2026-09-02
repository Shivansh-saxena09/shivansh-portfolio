import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "About Page", href: "/admin/about" },
  { label: "Resume", href: "/admin/resume" },
  { label: "Contact Info", href: "/admin/contact" },
  { label: "Site Settings", href: "/admin/settings" },
] as const;

/**
 * Shell for every authenticated /admin route. Middleware already redirects
 * signed-out visitors to /admin/login before this ever renders, but this
 * check is cheap defense-in-depth (and gives us the user's email to show).
 */
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-beige-border bg-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/admin" className="font-heading text-lg font-bold text-charcoal">
            Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-xs text-warm-grey sm:inline">{user.email}</span>
            <Link
              href="/"
              target="_blank"
              className="font-body text-xs font-medium text-sage-dark hover:underline"
            >
              View site ↗
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-beige-border px-4 py-1.5 font-body text-xs font-medium text-charcoal transition-colors hover:border-terracotta hover:text-terracotta-dark"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-3 sm:px-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3.5 py-1.5 font-body text-sm text-charcoal transition-colors hover:bg-terracotta/10 hover:text-terracotta-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
