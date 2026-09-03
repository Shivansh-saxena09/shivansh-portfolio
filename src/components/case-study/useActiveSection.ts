"use client";

import { useEffect, useState } from "react";

/**
 * Shared scroll-spy primitive — an IntersectionObserver watching a set of
 * section ids, returning whichever one currently owns the reading
 * position. Used by both the mobile pill nav and the desktop sidebar
 * panel (TableOfContents.tsx and CaseStudySidebarPanel.tsx); each mounts
 * its own observer since the two are mutually exclusive by breakpoint
 * but not unmounted, and a second lightweight IntersectionObserver costs
 * nothing worth a shared-context workaround.
 */
export function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Treats a section as "current" once it crosses a band near the
      // top of the viewport, not merely once any part of it is visible.
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
