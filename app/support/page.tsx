import type { Metadata } from "next";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { LaunchButton } from "@/components/launch-button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { supportTopics } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Live Orbit support, report a data issue, request a feature, or join the prelaunch list."
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Support for launch questions, data issues, and product feedback."
        body="Live Orbit is prelaunch. Use the support address for launch updates, bug reports, satellite data issues, feature requests, and future billing questions."
      />

      <section className="page-shell pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr]">
          <Reveal>
            <div className="surface-shell">
              <div className="surface-core p-6 md:p-8">
                <span className="grid size-14 place-items-center rounded-full bg-[oklch(0.78_0.15_162_/_0.1)] text-[var(--green)]">
                  <EnvelopeSimple size={25} weight="duotone" />
                </span>
                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.05em] text-[var(--text)]">Email support</h2>
                <a className="mt-3 block text-lg font-semibold text-[var(--green)]" href={`mailto:${site.supportEmail}`}>
                  {site.supportEmail}
                </a>
                <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
                  Include your device model, iOS version, what you expected, and what happened. Do not send private credentials or API keys.
                </p>
                <div className="mt-7">
                  <LaunchButton />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-3">
            {supportTopics.map((topic) => (
              <Reveal key={topic}>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] px-5 py-4 text-base font-semibold tracking-[-0.02em] text-[var(--text)]">
                  {topic}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
