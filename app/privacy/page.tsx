import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Live Orbit privacy details for location, analytics, cached catalog data, and support contact."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy designed for a sky app, not an account network."
        body="Live Orbit is built around public satellite data, local device context, and clear limits on telemetry."
      />
      <article className="page-shell max-w-3xl pb-24 text-base leading-8 tracking-[-0.01em] text-[var(--muted)]">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">No account required</h2>
        <p className="mt-3">Live Orbit does not require an account for the core app experience.</p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Location</h2>
        <p className="mt-3">
          Location is used to calculate visible passes and support Sky Mode or AR pointing. Location access is controlled by iOS permission settings.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Analytics and diagnostics</h2>
        <p className="mt-3">
          The app may use privacy-safe product analytics, crash diagnostics, performance signals, and MetricKit-style health data. Analytics should not log exact location, email addresses, raw search text, raw URLs, API keys, or credentials.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Satellite catalog data</h2>
        <p className="mt-3">
          Live Orbit uses public satellite data and cached catalog data to power the product. Cached app data can be cleared from the app settings.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Support</h2>
        <p className="mt-3">
          If you contact support, the information you choose to include in the email is used to respond to your request. Contact{" "}
          <a className="font-semibold text-[var(--green)]" href={`mailto:${site.supportEmail}`}>
            {site.supportEmail}
          </a>
          .
        </p>
      </article>
    </>
  );
}
