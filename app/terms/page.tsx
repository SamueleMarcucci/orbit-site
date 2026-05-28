import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Terms",
  description: "Live Orbit terms and safety limits for satellite positions, passes, and AR pointing."
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Satellite tracking with clear limits."
        body="Live Orbit is an informational app for learning, observation, and personal sky awareness."
      />
      <article className="page-shell max-w-3xl pb-24 text-base leading-8 tracking-[-0.01em] text-[var(--muted)]">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Estimated data</h2>
        <p className="mt-3">
          Satellite positions, passes, and AR pointing are estimates based on public orbital data and device context. They may be delayed, incomplete, or inaccurate.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Not safety critical</h2>
        <p className="mt-3">
          Live Orbit is not for navigation, safety-critical operations, collision avoidance, operational satellite control, emergency response, or any use where an inaccurate estimate could cause harm.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Prelaunch status</h2>
        <p className="mt-3">
          Live Orbit is prelaunch. Website copy, feature availability, pricing, and release timing may change before public availability.
        </p>
      </article>
    </>
  );
}
