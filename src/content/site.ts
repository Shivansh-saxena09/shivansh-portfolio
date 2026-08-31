/**
 * Central placeholder content.
 *
 * Everything here is a stand-in for data that will eventually live in
 * Supabase and be editable from /admin (see CLAUDE.md → Admin Panel).
 * Keeping it in one typed module now — instead of hardcoding strings
 * inside components — means the later swap is: replace these exports
 * with a Supabase fetch, keep every component's props the same shape.
 */

export const person = {
  name: "Shivansh Saxena",
  tagline: "Performance Marketing Manager. Full-stack builder.",
  company: "Divya Padma Infosystem LLP",
  domain: "shivanshdigital.com",
} as const;

export const heroCopy = {
  eyebrow: "Performance Marketing Manager",
  heading: "I turn ad spend into pipeline.",
  subheading:
    "Meta Ads, Google Ads, and Conversions API campaigns for real estate lead generation — backed by the full-stack systems I build to track, qualify, and report on every lead.",
} as const;

/** Single admin-editable status line — "Currently Working On" widget. */
export const currentlyWorkingOn = {
  text: "Rebuilding lead-qualification tracking with server-side Conversions API for a new campaign launch.",
  updatedAt: "2026-08-24",
} as const;

export const nav = [
  { label: "Marketing Work", href: "/marketing" },
  { label: "Engineering", href: "/engineering" },
  { label: "About", href: "/about" },
] as const;

/** Placeholders — will be replaced with real values via admin Contact Info Manager. */
export const contact = {
  email: "hello@shivanshdigital.com",
  whatsapp: "https://wa.me/910000000000",
  linkedin: "https://linkedin.com/in/shivansh-saxena",
  github: "https://github.com/Shivansh-saxena09",
} as const;

export const footerNote = "Based in India · Open to remote work" as const;

/**
 * ⚠️ PLACEHOLDER FILE. Generated, not the real resume — see
 * public/resume-placeholder.pdf. Swap this for a real uploaded PDF via
 * the admin's Resume Manager (CLAUDE.md → Admin Panel) once it exists;
 * every component reads the URL from here, so that's the only edit needed.
 */
export const resumeUrl = "/resume-placeholder.pdf" as const;
