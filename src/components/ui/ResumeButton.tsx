import { resumeUrl, person } from "@/content/site";

/**
 * Resume download (CLAUDE.md → /engineering + /about → vitals card). The
 * linked file is a generated placeholder (public/resume-placeholder.pdf,
 * a real one-page PDF that says as much) — swap `resumeUrl` in
 * src/content/site.ts for a real uploaded PDF once the admin's Resume
 * Manager exists; every usage of this button updates automatically.
 */
export function ResumeButton({
  variant = "secondary",
  className = "",
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 font-body text-sm font-medium tracking-wide transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-terracotta text-ivory hover:bg-terracotta-dark"
      : "border border-beige-border text-charcoal hover:border-sage hover:text-sage-dark";

  return (
    <a
      href={resumeUrl}
      download={`${person.name.replace(/\s+/g, "-")}-Resume.pdf`}
      className={`${base} ${styles} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
      >
        <path
          d="M12 3v13m0 0-4.5-4.5M12 16l4.5-4.5M4 20h16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Download Resume
    </a>
  );
}
