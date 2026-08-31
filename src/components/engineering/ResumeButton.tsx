/**
 * Resume download (CLAUDE.md → /engineering): "uploadable via admin".
 * No admin panel and no real PDF exist yet, so this renders as an honest
 * disabled state rather than linking to a file that doesn't exist.
 * Swap for a real <a href={resumeUrl} download> once the admin's Resume
 * Manager can upload one.
 */
export function ResumeButton() {
  return (
    <span
      aria-disabled="true"
      title="Resume upload coming with the admin panel"
      className="inline-flex cursor-not-allowed items-center justify-center rounded-full border border-beige-border px-8 py-4 font-body text-sm font-medium text-warm-grey"
    >
      Download Resume — coming soon
    </span>
  );
}
