import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Live Orbit terms and safety limits."
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        code="TERMS/USE"
        title="Use the app as a sky guide, not as an operational authority."
        body="The product presents public orbital data and estimates. It is built for personal satellite awareness and viewing context."
      />
      <article className="legal-ledger">
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
      </article>
    </>
  );
}
