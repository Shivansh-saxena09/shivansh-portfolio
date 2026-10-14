"use client";

/**
 * Loader family: one per real wait, same palette and parts, different motion
 * per context. Keyframes live in globals.css (ld-*); reduced motion keeps a
 * static minimal indicator.
 */

/** Three bars bouncing; fits inside a pill button. */
export function ButtonLoader({ className = "" }: { className?: string }) {
  return (
    <span role="status" aria-label="Working" className={`ld-bars inline-flex h-4 items-end gap-[3px] ${className}`}>
      <i className="h-full w-[3px] rounded-full bg-current" />
      <i className="h-full w-[3px] rounded-full bg-current" />
      <i className="h-full w-[3px] rounded-full bg-current" />
    </span>
  );
}

/** Success check that draws itself. */
export function CheckMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3 8.5 6.5 12 13 4.5" pathLength={1} className="ld-check fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Upload in flight: a document riding an indeterminate track (server actions report no byte progress, so no fake %). */
export function UploadProgress({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <svg viewBox="0 0 20 24" aria-hidden="true" className="ld-doc h-6 w-5 shrink-0 text-terracotta">
        <path d="M2 1h11l5 5v17H2z" className="fill-ivory stroke-current" strokeWidth="1.4" />
        <path d="M10 18v-8m0 0-3 3m3-3 3 3" className="fill-none stroke-sage-dark" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="relative h-1.5 w-40 overflow-hidden rounded-full bg-beige-border">
        <i className="ld-track absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-terracotta to-sage" />
      </span>
      <span className="font-body text-xs text-warm-grey">{label}</span>
    </div>
  );
}

/** Finished state for a save/upload: check or cross, with the action's own message. */
export function DoneState({ ok, message }: { ok: boolean; message?: string | null }) {
  return (
    <p role={ok ? "status" : "alert"} className={`ld-pop flex items-center gap-2 font-body text-sm ${ok ? "text-sage-dark" : "text-terracotta-dark"}`}>
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ok ? "bg-sage/15" : "bg-terracotta/10"}`}>
        {ok ? (
          <CheckMark />
        ) : (
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path d="M4 4l8 8M12 4l-8 8" className="stroke-current" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {message}
    </p>
  );
}

/** Tiny funnel filling, for route-level loading. */
export function FunnelLoader({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" role="status" aria-label="Loading" className={className}>
      <defs>
        <clipPath id="ld-f">
          <path d="M6 8h28l-9 12v10l-10 4V20z" />
        </clipPath>
      </defs>
      <path d="M6 8h28l-9 12v10l-10 4V20z" className="fill-ivory stroke-terracotta" strokeWidth="1.5" strokeLinejoin="round" />
      <g clipPath="url(#ld-f)">
        <rect className="ld-fill fill-terracotta" x="0" y="0" width="40" height="40" />
      </g>
    </svg>
  );
}
