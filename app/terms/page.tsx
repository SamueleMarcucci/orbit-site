import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "Live Orbit terms and safety limits.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="minimal-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Terms", path: "/terms" }])} />
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Terms</h1>
        <p>Live Orbit is a sky guide for personal satellite awareness. It is not operational authority.</p>
      </header>

      <div className="minimal-ledger">
        <section>
          <h2>Use of Live Orbit</h2>
          <p>Live Orbit is provided by Apps Made Better LLC for satellite watching, education, planning, and general space exploration. You are responsible for using the app safely and following applicable laws.</p>
        </section>
        <section>
          <h2>Subscriptions, trials, cancellation, and refunds</h2>
          <p>Live Orbit Pro may be offered through monthly and yearly auto-renewable subscriptions. Apple displays the final localized price, billing period, trial eligibility, taxes, and purchase terms before you confirm a purchase.</p>
          <p>If Apple offers a free trial, it converts to a paid auto-renewable subscription unless canceled before the trial ends. Subscriptions renew automatically unless canceled through Apple Account or App Store subscription settings.</p>
          <p>Apple processes App Store payments, cancellations, and refund requests. Apps Made Better LLC does not receive your full payment card information or process App Store refunds directly.</p>
        </section>
        <section>
          <h2>License and privacy</h2>
          <p>
            Use of Live Orbit is also subject to Apple&apos;s{" "}
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Standard Licensed Application End User License Agreement</a>.
          </p>
          <p>
            The <Link href="/privacy" prefetch={false}>Live Orbit Privacy Policy</Link> explains how app, purchase, location, support, analytics, and diagnostic information is handled.
          </p>
        </section>
        <section>
          <h2>Estimates</h2>
          <p>Satellite positions, passes, maps, and AR pointing are estimates derived from orbital data and device context. They can be wrong or stale.</p>
        </section>
        <section>
          <h2>Restricted use</h2>
          <p>Do not use Live Orbit for navigation, collision avoidance, satellite control, emergency operations, or any safety-critical decision.</p>
        </section>
        <section>
          <h2>Public data</h2>
          <p>Live Orbit relies on public orbital and reference sources. Data availability, freshness, and accuracy can vary by source.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        </section>
      </div>
    </article>
  );
}
