"use client";

import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { useReferrerBias } from "@/lib/useReferrerBias";
import { Container } from "@/components/ui/Container";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HeroStory, type Milestone } from "@/components/home/HeroStory";
import type { PhoneStoryProps } from "@/components/home/PhoneStory";

// Phone-only film: fetched only when the phone query matches, so tablet and
// desktop never download it.
const PhoneStory = dynamic(() => import("@/components/home/PhoneStory").then((m) => m.PhoneStory), { ssr: false });
const PHONE = "(max-width: 639.98px)";

type Identity = { name: string; role: string; tagline: string };

/**
 * The hero is a single pantomime scene (HeroStory): the funnel, pipeline,
 * AI agent and résumé document are the page's four navigation links. The identity
 * block is one real h1 (name + role) shared by both compositions — in flow
 * above the scene on phones/tablets, laid into the scene's empty top-left
 * on desktop. Sizes there use cqw so it scales with the scene.
 */
export function Hero({
  identity,
  visual,
  milestones,
  resumeUrl,
  education,
  place,
}: {
  identity: Identity;
  visual: HeroVisualContent;
  milestones: Milestone[];
  resumeUrl: string;
  education: PhoneStoryProps["education"];
  place: PhoneStoryProps["place"];
}) {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  // Referrer bias: default (no/unknown referrer) only Marketing is vivid;
  // a LinkedIn referrer also lights Engineering — Marketing never dims.
  const engineeringLeaning = useReferrerBias() === "engineering-leaning";
  const shared = {
    c: visual,
    milestones,
    resumeUrl,
    resumeFileName: `${identity.name.replace(/\s+/g, "-")}-Resume.pdf`,
    engineeringLeaning,
  };

  return (
    <section className="relative overflow-hidden border-b border-beige-border/70 bg-cream pt-4 pb-6 max-sm:flex max-sm:max-h-[calc(100svh-var(--hdr-h))] max-sm:flex-col max-sm:pt-3 max-sm:pb-4 [@media(max-width:639.98px)_and_(max-height:700px)]:pt-2 [@media(max-width:639.98px)_and_(max-height:700px)]:pb-3 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-16">
      {/* Phones: the hero fits the viewport under the header; only the film shrinks. */}
      <Container className="max-sm:flex max-sm:min-h-0 max-sm:w-full max-sm:flex-1 max-sm:flex-col">
        <div className="relative mx-auto max-w-[520px] [container-type:inline-size] max-sm:flex max-sm:min-h-0 max-sm:w-full max-sm:flex-1 max-sm:flex-col lg:max-w-none">
          <div className="relative z-30 lg:absolute lg:top-0 lg:left-0 lg:w-[46%]">
            <h1 className="font-heading text-charcoal">
              <span className="block text-[8.6cqw] leading-[1.05] font-bold tracking-tight [@media(max-width:639.98px)_and_(max-height:700px)]:text-[7.4cqw] lg:text-[5.2cqw]">
                {identity.name}
              </span>
              <span className="sr-only"> — </span>
              <span className="mt-[1.6cqw] block font-body text-[3cqw] font-semibold tracking-[0.2em] text-terracotta uppercase [@media(max-width:639.98px)_and_(max-height:700px)]:mt-[0.8cqw] lg:mt-[1cqw] lg:text-[1.05cqw]">
                {identity.role}
              </span>
            </h1>
            <p className="mt-[1.6cqw] font-heading text-[4.4cqw] text-warm-grey italic [@media(max-width:639.98px)_and_(max-height:700px)]:mt-[0.6cqw] [@media(max-width:639.98px)_and_(max-height:700px)]:text-[4cqw] lg:mt-[1.1cqw] lg:text-[1.9cqw]">
              {identity.tagline}
            </p>
          </div>

          {/* Phones (<640): wordless Stories film + a server-rendered link dock.
              The dock sits outside the tap stage, so links always win. */}
          <div className="mt-[3cqw] flex min-h-0 flex-1 flex-col [@media(max-width:639.98px)_and_(max-height:700px)]:mt-0 sm:hidden">
            <p className="sr-only">{visual.storyText}</p>
            <div id="p-hud" className="relative min-h-0 pt-11 [container-type:size]" style={{ flex: "0 1 calc(116.7cqw + 2.75rem)" }}>
              {phone && (
                <PhoneStory
                  c={visual}
                  name={identity.name}
                  milestones={milestones}
                  education={education}
                  place={place}
                  resumeUrl={resumeUrl}
                  resumeFileName={shared.resumeFileName}
                />
              )}
            </div>
            <nav className="mt-3 grid shrink-0 grid-cols-2 gap-2 [@media(max-width:639.98px)_and_(max-height:700px)]:mt-2">
              {(
                [
                  ["/marketing", visual.linkLabels[0], true],
                  ["/engineering", visual.linkLabels[1], engineeringLeaning],
                  ["/engineering#ai", visual.linkLabels[2], false],
                ] as const
              ).map(([href, label, vivid]) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-h-12 items-center justify-center rounded-full border px-3 text-center font-body text-sm font-semibold focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${vivid ? "border-terracotta bg-terracotta text-ivory" : "border-beige-border bg-ivory text-charcoal"}`}
                >
                  {label}
                </Link>
              ))}
              <a
                href={resumeUrl}
                download={shared.resumeFileName}
                aria-label={`${visual.linkLabels[3]} (${visual.resumeMeta} download)`}
                className="flex min-h-12 items-center justify-center rounded-full border border-sage bg-ivory px-3 font-body text-sm font-semibold text-sage-dark focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                {visual.linkLabels[3]}
              </a>
            </nav>
          </div>
          <div className="mt-[4cqw] hidden sm:block lg:hidden">
            <HeroStory variant="mobile" {...shared} />
          </div>
          <div className="hidden lg:block">
            <HeroStory variant="desktop" {...shared} />
          </div>
        </div>
      </Container>
    </section>
  );
}
