"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Lite YouTube embed — a static thumbnail + play button; the real
 * iframe (and YouTube's own JS) only loads after a click, so a project
 * page with a demo video costs nothing extra until someone actually
 * wants to watch it. Generic per-project (Project.demoVideoUrl), not
 * tied to any one project — accepts any standard YouTube URL shape.
 */
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.replace("/embed/", "");
      if (u.pathname.startsWith("/shorts/")) return u.pathname.replace("/shorts/", "");
    }
  } catch {
    return null;
  }
  return null;
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  if (playing) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-beige-border bg-charcoal">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={`${title} — demo video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play demo video for ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-beige-border bg-charcoal"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={`${title} demo video thumbnail`}
        fill
        sizes="(min-width: 1024px) 800px, 100vw"
        className="object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-charcoal/10 transition-colors group-hover:bg-charcoal/0" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-ivory shadow-[0_8px_24px_-6px_rgba(43,38,34,0.5)] transition-transform duration-200 group-hover:scale-110">
          <PlayIcon className="ml-1 h-6 w-6" />
        </span>
      </span>
    </button>
  );
}
