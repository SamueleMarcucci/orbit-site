import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { featureCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore Live Orbit features: globe, search, satellite details, visible passes, Sky Mode, insights, and news."
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        title="Live satellite tracking, shaped for the way people actually use the sky."
        body="Live Orbit connects the main globe, satellite index, pass predictions, Sky Mode, insights, and news into one product language."
        cta
      />

      <section className="page-shell pb-24">
        <div className="grid gap-5">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title}>
                <article className="surface-shell">
                  <div className="surface-core grid gap-8 p-6 md:grid-cols-[0.42fr_1fr] md:items-center md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-[var(--faint)]">0{index + 1}</span>
                      <span className="grid size-14 place-items-center rounded-full bg-white/[0.055] text-[var(--green)]">
                        <Icon size={26} weight="duotone" />
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--text)] md:text-5xl">{feature.title}</h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 tracking-[-0.01em] text-[var(--muted)]">{feature.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="page-shell section-space pt-0">
        <SectionHeading
          title="Built around real product flows, not a poster page."
          body="The website mirrors the app: first a globe, then a satellite detail sheet, then pass predictions and Sky Mode when you are ready to observe."
        />
      </section>
    </>
  );
}
