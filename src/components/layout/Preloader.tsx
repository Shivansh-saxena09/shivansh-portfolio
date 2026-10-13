"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Avatar } from "@/components/home/sceneParts";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const SEEN_KEY = "pl-seen";

/**
 * Opening shot of the homepage film — the same flat character on the same
 * cream ground, with the name (site settings) as the title card. Wordless
 * otherwise. Once per browser session; skipped entirely for reduced motion.
 *
 * - First frame is pure SSR + CSS (character pops, name rises), so the
 *   page paints immediately and nothing waits on JS.
 * - After hydration GSAP adds a wave, then the exit: the character runs to
 *   exactly where the hero's character starts (its off-screen entry point,
 *   measured live) while a circular wipe opens on that point, revealing the
 *   hero's opening frame. "preloader:done" fires as it leaves frame, and the
 *   hero character walks in from the same spot — one continuous shot.
 * - Exit begins ~1s after navigation start (or right after hydration if
 *   that is later), so the whole thing stays around 2s and never holds a
 *   ready page.
 * - Desktop: character beside a one-word-per-line title, exits left.
 *   Mobile: character above a stacked title, exits right (where the mobile
 *   hero character enters).
 * - Phones (<640): the rule is the story's 8-segment progress bar filling,
 *   and before exiting it waits (capped, still < 2s total) for the phone
 *   story to mount, so the wipe always opens on the story's first frame —
 *   never on an empty stage — and the character runs to the story
 *   character's own entry point (left).
 * - "preloader:done" also sets <html data-pl-done>, so a story that mounts
 *   after the event still starts.
 * - Repeat views: an inline <head> script adds `pl-seen` to <html> before
 *   first paint and CSS hides this overlay — no flash, no wait. A CSS
 *   failsafe hides it after 3.5s even if JS never runs.
 */
export function Preloader({ personName }: { personName: string }) {
  const [show, setShow] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (document.documentElement.classList.contains("pl-seen") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    const q = gsap.utils.selector(root);
    const char = q(".pl-char")[0] as Element;
    const bg = q(".pl-bg")[0] as HTMLElement;
    const armR = q(".av-armR");
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const phone = window.matchMedia("(max-width: 639.98px)").matches;
    const exitAt = Math.max(0.35, 1.0 - performance.now() / 1000);
    // Phone story is lazy-loaded: hold the exit until its character exists (cap ~1.3s after navigation).
    const storyReady = () =>
      new Promise<void>((done) => {
        const check = () => {
          const el = document.querySelector(".p-stage .av-pos");
          if ((el && el.getBoundingClientRect().height > 0) || performance.now() > 1300) done();
          else requestAnimationFrame(check);
        };
        check();
      });

    const ctx = gsap.context(() => {
      gsap.set(q(".av-armL,.av-armR,.av-legL,.av-legR"), { transformOrigin: "50% 0%" });
      const tl = gsap.timeline({ onComplete: () => setShow(false) });

      // hello — wave while the title settles
      tl.set(q(".av-m-grin"), { opacity: 0 }, 0)
        .set(q(".av-m-open"), { opacity: 1 }, 0)
        .to(armR, { rotation: -150, duration: 0.2, ease: "back.out(2)" }, 0)
        .to(armR, { rotation: -120, duration: 0.13, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.2)
        .to(armR, { rotation: -8, duration: 0.2 }, Math.max(0.75, exitAt - 0.15));

      if (phone) tl.addPause(exitAt - 0.01, () => void storyReady().then(() => tl.resume()));

      // exit: run to the hero character's entry point while the wipe opens on it
      tl.add(() => {
        const target = [...document.querySelectorAll<SVGGElement>("main .av-pos")].map((el) => el.getBoundingClientRect()).find((r) => r.width > 0);
        const from = char.getBoundingClientRect();
        const fx = from.left + from.width / 2;
        const tx = target ? target.left + target.width / 2 : desktop ? -from.width : innerWidth + from.width;
        const ty = target ? target.bottom : from.bottom;
        const s = target ? Math.min(1, target.height / (from.height * 0.94)) : 0.8;
        const cx = Math.min(Math.max(tx, 0), innerWidth);
        const cy = Math.min(Math.max(ty - (target?.height ?? 0) / 2, 0), innerHeight);
        const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 40;
        bg.style.setProperty("--px", `${cx}px`);
        bg.style.setProperty("--py", `${cy}px`);
        gsap
          .timeline()
          .to(char, { scaleY: 0.9, scaleX: 1.06, transformOrigin: "50% 100%", duration: 0.1, ease: "power1.in" })
          .to(char, { x: tx - fx, y: ty - from.bottom, scale: s, duration: 0.55, ease: "power2.in" })
          .to(q(".av-legL"), { rotation: 24, duration: 0.09, yoyo: true, repeat: 5 }, 0.1)
          .to(q(".av-legR"), { rotation: -24, duration: 0.09, yoyo: true, repeat: 5 }, 0.1)
          .to(q(".pl-word"), { yPercent: -115, duration: 0.32, stagger: 0.05, ease: "power3.in" }, 0)
          .to(q(".pl-rule"), { scaleX: 0, duration: 0.25, ease: "power2.in" }, 0)
          .fromTo(bg, { "--pr": "0px" }, { "--pr": `${r}px`, duration: 0.6, ease: "power2.in" }, 0.15)
          .add(() => {
            document.documentElement.dataset.plDone = "1";
            window.dispatchEvent(new Event("preloader:done"));
          }, 0.55);
      }, exitAt);
      tl.to({}, { duration: phone ? 0.5 : 0.8 });
    }, root);
    return () => ctx.revert();
  }, []);

  if (!show) return null;

  const words = personName.trim().split(/\s+/);
  return (
    <div ref={ref} data-preloader aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      <div className="pl-bg absolute inset-0 bg-cream" />
      <div className="relative flex h-full flex-col items-center justify-center gap-[4vh] px-6 lg:flex-row lg:gap-14">
        <svg viewBox="-60 -200 120 206" className="pl-char h-[30vh] max-h-60 w-auto overflow-visible lg:h-72 lg:max-h-none">
          <Avatar x={0} y={0} pose="rest" />
        </svg>
        <div className="text-center lg:text-left">
          <p className="font-heading text-[14vw] leading-[0.98] font-bold tracking-tight text-charcoal lg:text-[5.6rem]">
            {words.map((w, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <span className="pl-word inline-block" style={{ animationDelay: `${0.12 + i * 0.1}s` }}>
                  {w}
                </span>
              </span>
            ))}
          </p>
          <span className="pl-rule mx-auto mt-[2vh] hidden h-[3px] w-20 origin-center bg-gradient-to-r from-terracotta to-sage sm:block lg:mx-0 lg:origin-left" />
          {/* Phones: the story's progress bar, filling — the film is about to start */}
          <span className="pl-rule mx-auto mt-[2.4vh] flex w-44 gap-1 sm:hidden">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-beige-border">
                <i className="pl-seg absolute inset-0 origin-left bg-terracotta" style={{ animationDelay: `${0.3 + i * 0.08}s` }} />
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
