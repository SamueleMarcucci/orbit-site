import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Live Orbit privacy notes for account, location, analytics, diagnostics, and cached catalog data."
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        code="PRIVACY/STATEMENT"
        title="Privacy rules for a sky app."
        body="Live Orbit is built around public satellite data, local device context, iOS permission controls, and limited diagnostics."
      />
      <article className="legal-ledger">
        <section>
          <h2>No account required</h2>
          <p>Live Orbit does not require an account for the core app experience.</p>
        </section>
        <section>
          <h2>Location</h2>
          <p>Location is used to calculate visible passes and support Sky Mode or AR pointing. Location access is controlled by iOS permission settings.</p>
        </section>
        <section>
          <h2>Analytics and diagnostics</h2>
          <p>
            Live Orbit uses Firebase Analytics for privacy-safe product usage events, Firebase Crashlytics for crash and non-fatal error reporting, Firebase Performance Monitoring for coarse app performance traces, and Apple MetricKit for summary-level diagnostics.
          </p>
          <p>
            These signals help understand app flow, reliability, startup readiness, catalog loading, search latency, pass calculation, Find AR preparation, and Sky Mode preparation. They must not include exact location, email addresses, search text, raw catalog data, raw TLE data, API keys, Space-Track credentials, camera data, or raw satellite history tied to a user.
          </p>
        </section>
        <section>
          <h2>Satellite catalog data</h2>
          <p>Live Orbit uses public satellite data and cached catalog data to power the product. Cached app data can be cleared from the app settings.</p>
        </section>
        <section>
          <h2>Support</h2>
          <p>
            If you contact support, the information you choose to include in the email is used to respond to your request. Contact <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        </section>
      </article>
    </>
  );
}
