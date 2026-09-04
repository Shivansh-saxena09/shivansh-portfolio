function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Shown automatically in place of the real embed whenever a project has
 * no demoVideoUrl yet — no manual toggle, ProjectPage just renders one
 * or the other. Reuses the site's "Quick Take"/Campaign Doctor dark-card
 * treatment (rotating conic-gradient ring, drifting ambient glows,
 * paper-grain — see .quick-take-* in globals.css) so an unfinished video
 * reads as "on the way," not as a missing/broken feature. Deliberately
 * not clickable and uses a plain video-camera icon rather than a play
 * triangle, so it doesn't invite a tap the way YouTubeEmbed's real
 * thumbnail does. Same aspect-video shape as YouTubeEmbed, so swapping
 * in a real video later doesn't shift the page layout.
 */
export function DemoVideoComingSoon() {
  return (
    <div className="quick-take-border rounded-2xl">
      <div className="paper-grain relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl bg-charcoal px-8 text-center">
        <div
          aria-hidden="true"
          className="quick-take-glow-a pointer-events-none absolute -top-14 -right-10 h-44 w-44 rounded-full bg-terracotta/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="quick-take-glow-b pointer-events-none absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-sage/25 blur-3xl"
        />

        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sage">
          <VideoIcon className="h-6 w-6 text-ivory" />
        </span>
        <p className="relative z-10 mt-4 font-heading text-lg font-semibold text-cream">
          Demo video coming soon
        </p>
        <p className="relative z-10 mt-1.5 max-w-xs font-body text-sm text-cream/55">
          A full walkthrough of this project is in the works.
        </p>
      </div>
    </div>
  );
}
