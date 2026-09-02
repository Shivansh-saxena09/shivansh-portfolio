"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { highlightCode } from "@/lib/highlightCode";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Snippet = { filename: string; code: string };

/**
 * Floating "code editor" card in the /engineering hero — the page's own
 * echo of the homepage's floating glass card and /about's marketing-
 * concept panel. Rotates through the featured project's real challenge
 * snippets (not placeholder/decorative code, fetched server-side by the
 * page and passed down since this component itself needs client state
 * for the auto-advance timer), auto-advancing since it's above the fold
 * and not scroll-linked. Pauses on reduced-motion, matching the rest of
 * the site.
 */
export function CodeCard({ snippets }: { snippets: Snippet[] }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || snippets.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % snippets.length);
    }, 4500);
    return () => clearInterval(id);
  }, [reducedMotion, snippets.length]);

  if (snippets.length === 0) return null;
  const active = snippets[index];

  return (
    <div className="glass-card relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
      <div className="relative z-10 flex items-center gap-2 border-b border-beige-border/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-terracotta/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-sage/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-beige-border" />
        <span className="ml-2 font-mono text-xs text-warm-grey">{active.filename}</span>
      </div>

      <div className="relative z-10 min-h-[130px] px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[13px] leading-relaxed text-charcoal"
          >
            {highlightCode(active.code)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 border-t border-beige-border/70 px-4 py-3">
        {snippets.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-terracotta" : "w-1.5 bg-beige-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
