import Link from "next/link";

const sections = [
  { label: "Case Studies", href: "/admin/case-studies", description: "Campaign case studies, ad sets, and narrative." },
  { label: "Projects", href: "/admin/projects", description: "Engineering projects, flow steps, and challenges." },
  { label: "Skills", href: "/admin/skills", description: "Tag-based skills used across case studies and the timeline." },
  { label: "Experience", href: "/admin/experience", description: "Work history and each entry's Quick Take challenge." },
  { label: "About Page", href: "/admin/about", description: "Story, quick facts, and education." },
  { label: "Resume", href: "/admin/resume", description: "Upload or replace the downloadable PDF." },
  { label: "Contact Info", href: "/admin/contact", description: "Email, WhatsApp, LinkedIn, GitHub — reflected sitewide." },
  { label: "Site Settings", href: "/admin/settings", description: "Hero copy, \"Currently Working On\", services, SEO per page." },
] as const;

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-charcoal">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">Everything here edits the live site directly.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-beige-border bg-ivory p-5 shadow-[0_1px_3px_rgba(43,38,34,0.05)] transition-colors hover:border-terracotta/40"
          >
            <p className="font-heading text-lg font-bold text-charcoal">{s.label}</p>
            <p className="mt-1 font-body text-sm text-warm-grey">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
