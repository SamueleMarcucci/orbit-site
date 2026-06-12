import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Live Orbit terms and safety limits."
};

export default function TermsPage() {
  return (
    <article className="minimal-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Terms</h1>
        <p>Live Orbit is a sky guide for personal satellite awareness. It is not operational authority.</p>
      </header>

      <div className="minimal-ledger">
        <section>
          <h2>Prelaunch status</h2>
          <p>Live Orbit is prelaunch. This website does not claim the app is publicly downloadable until a real launch or TestFlight link exists.</p>
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
