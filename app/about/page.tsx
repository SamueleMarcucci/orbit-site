import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Live Orbit is designed and developed by Samuele Marcucci as a cleaner way to explore live satellites and the sky around you."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="A cleaner way to explore live satellites and the sky around you."
        body="Live Orbit is designed and developed by Samuele Marcucci. The product focuses on making satellite tracking visual, readable, and honest about what orbital estimates can do."
        cta
      />

      <section className="page-shell pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <Reveal>
            <div className="surface-shell">
              <div className="surface-core p-6 md:p-8">
                <Image src="/assets/live-orbit-icon.png" alt="Live Orbit app icon" width={104} height={104} className="rounded-[1.6rem]" />
                <h2 className="mt-8 text-4xl font-semibold leading-[1] tracking-[-0.055em] text-[var(--text)] md:text-6xl">
                  Built from the app outward.
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-5 text-base leading-8 tracking-[-0.01em] text-[var(--muted)]">
              <p>
                The app is not a generic space dashboard. The globe is the hero, the detail sheets stay readable, and the deeper catalog facts are available without overwhelming the first view.
              </p>
              <p>
                Live Orbit is free today in the app plan, with future Pro ideas treated as coming later. This site does not sell a download that is not public yet.
              </p>
              <p>
                The goal is a trustworthy launch surface for people who want to understand what is above them, from a first visible pass to a deeper orbital catalog read.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
