import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { Container } from "@/components/ui/Container";

/**
 * Target of the homepage scene's AI node (/engineering#ai). Deliberately a
 * section, not its own page: until real AI write-ups exist there's only a
 * status to show, and a standalone thin page would add nothing. Copy comes
 * from the same admin "Hero Scene" fields as the node itself.
 */
export function AiWorkSection({ content }: { content: HeroVisualContent }) {
  return (
    <section id="ai" className="scroll-mt-24 border-t border-beige-border/70 py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
            {content.aiLabel}
          </span>
          <span className="rounded-full bg-sage/20 px-3 py-1 font-body text-[11px] font-bold tracking-[0.12em] text-sage-dark uppercase">
            {content.aiStatus}
          </span>
        </div>
        <h2 className="mt-4 max-w-2xl font-heading text-3xl font-bold text-charcoal sm:text-4xl">
          {content.aiSectionHeading}
        </h2>
        <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-warm-grey">
          {content.aiSectionBody}
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {content.aiItems.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-dashed border-sage/60 bg-ivory px-5 py-4 font-mono text-sm text-sage-dark"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
