import { ArrowDown, CheckCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { LaunchButton } from "@/components/launch-button";
import { OrbitVisual } from "@/components/orbit-visual";
import { PhoneFrame } from "@/components/phone-frame";
import { Reveal } from "@/components/reveal";
import { ScrollStory } from "@/components/scroll-story";
import { SectionHeading } from "@/components/section-heading";
import { featureCards, proofPoints, trustItems } from "@/lib/content";

function toneClass(tone: string) {
  if (tone === "green") return "text-[var(--green)] bg-[oklch(0.78_0.15_162_/_0.1)]";
  if (tone === "blue") return "text-[var(--blue)] bg-[oklch(0.68_0.17_242_/_0.12)]";
  return "text-[var(--silver)] bg-white/[0.055]";
}

export default function HomePage() {
  return (
    <>
      <section className="wide-shell grid items-center gap-10 pb-16 pt-32 md:min-h-[92dvh] lg:grid-cols-[0.92fr_1fr] lg:pt-28">
        <Reveal>
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)]">
              Prelaunch for iPhone
            </p>
            <h1 className="text-balance text-6xl font-semibold leading-[0.92] tracking-[-0.07em] text-[var(--text)] md:text-8xl lg:text-[6.8rem]">
              See what is above Earth right now.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 tracking-[-0.02em] text-[var(--muted)] md:text-xl">
              Live Orbit brings live satellites, visible passes, Sky Mode, insights, and space news into one calm iPhone experience.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LaunchButton />
              <LaunchButton variant="secondary" href="/features/">
                Explore features
              </LaunchButton>
            </div>
            <div className="mt-9 flex flex-wrap gap-3 text-sm text-[var(--faint)]">
              {proofPoints.slice(0, 2).map((point) => (
                <span key={point} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                  <CheckCircle size={16} weight="fill" className="text-[var(--green)]" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="relative">
          <OrbitVisual />
          <div className="absolute -bottom-8 left-4 hidden w-64 rounded-[1.4rem] border border-white/10 bg-[oklch(0.1_0.018_248_/_0.78)] p-4 shadow-[0_22px_60px_oklch(0_0_0_/_0.32)] backdrop-blur-2xl md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--faint)]">Data honesty</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Positions are live estimates from public orbital elements.</p>
          </div>
        </Reveal>

        <a
          href="#proof"
          className="focus-ring absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] lg:inline-flex"
        >
          Scroll
          <ArrowDown size={14} weight="bold" />
        </a>
      </section>

      <section id="proof" className="page-shell py-10">
        <div className="grid gap-3 md:grid-cols-4">
          {proofPoints.map((point) => (
            <Reveal key={point}>
              <div className="min-h-28 rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4">
                <CheckCircle size={18} weight="fill" className="text-[var(--green)]" />
                <p className="mt-5 text-sm font-medium leading-6 text-[var(--muted)]">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <SectionHeading
            title="Designed for the moment you look up."
            body="Live Orbit stays readable for casual sky watchers, then opens into deeper catalog detail for users who want NORAD IDs, launch context, and orbit bands."
          />
          <div className="surface-shell">
            <div className="surface-core grid gap-4 p-4 sm:grid-cols-2">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1">
                    <div className={`mb-7 grid size-12 place-items-center rounded-full ${toneClass(feature.tone)}`}>
                      <Icon size={23} weight="duotone" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.035em] text-[var(--text)]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{feature.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ScrollStory />

      <section className="page-shell section-space">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1fr] lg:items-center">
          <Reveal>
            <PhoneFrame />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              title="The app is visual, but the claims stay grounded."
              body="Live Orbit turns public satellite data into a polished product experience without pretending estimates are operational truth."
            />
            <div className="mt-8 grid gap-3">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="flex gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.055] text-[var(--green)]">
                      <Icon size={20} weight="duotone" />
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-[-0.02em] text-[var(--text)]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wide-shell section-space">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[oklch(0.09_0.018_248)] p-6 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,oklch(0.68_0.17_242_/_0.16),transparent_22rem),radial-gradient(circle_at_72%_74%,oklch(0.78_0.15_162_/_0.12),transparent_20rem)]" />
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_22%,white_0_1px,transparent_1.5px),radial-gradient(circle_at_70%_66%,white_0_1px,transparent_1.5px)] [background-size:18rem_18rem,26rem_26rem]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green)]">For both modes</p>
              <h2 className="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-[var(--text)] md:text-7xl">
                Simple enough for tonight. Deep enough for orbitalists.
              </h2>
            </div>
            <div className="grid gap-3">
              {["Common names and aliases", "NORAD IDs and catalog detail", "Orbit bands and tracking signal", "Launches, reentries, insights, and news"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-[var(--muted)] backdrop-blur-xl">
                  <ShieldCheck size={17} weight="fill" className="text-[var(--green)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
