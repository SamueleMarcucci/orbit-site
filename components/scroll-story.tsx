"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { storySteps } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function ScrollStory() {
  const rootRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 960) return;

    const ctx = gsap.context(() => {
      gsap.to(rail, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: ".story-pin"
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="wide-shell section-space min-h-[150vh]">
      <div className="grid gap-8 lg:grid-cols-[0.84fr_1fr] lg:items-start">
        <div className="story-pin lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green)]">Orbit to sky</p>
          <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold leading-[1] tracking-[-0.055em] text-[var(--text)] md:text-6xl">
            A product story that starts with Earth and ends outside.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 tracking-[-0.01em] text-[var(--muted)]">
            Live Orbit is built around a simple path: understand what is orbiting, choose what matters, then know when and where to look.
          </p>
        </div>

        <div ref={railRef} className="grid gap-5">
          {storySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="surface-shell">
                <div className="surface-core grid min-h-[18rem] content-between p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--faint)]">0{index + 1}</span>
                    <span className="grid size-12 place-items-center rounded-full bg-white/[0.055] text-[var(--green)]">
                      <Icon size={22} weight="duotone" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-[-0.055em] text-[var(--text)] md:text-5xl">{step.title}</h3>
                    <p className="mt-4 max-w-xl text-base leading-7 tracking-[-0.01em] text-[var(--muted)]">{step.body}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
