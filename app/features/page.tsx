import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SectionLabel } from "@/components/section-label";
import { capabilityCells, sequence } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "Live Orbit feature manifest for globe tracking, pass predictions, Sky Mode, search, insights, and news."
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        code="FEATURE/MANIFEST"
        title="The product is a field instrument, not a fake command center."
        body="These features come from the local Live Orbit app surfaces: globe, satellite details, search, passes, Sky Mode, insights, news, privacy, and trusted data."
      />

      <section className="section-block">
        <SectionLabel code="MODULE/INDEX" title="Feature modules" />
        <div className="feature-ledger">
          {capabilityCells.map((cell) => (
            <article key={cell.code}>
              <samp>{cell.code}</samp>
              <h2>{cell.title}</h2>
              <p>{cell.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionLabel code="SKY/PIPELINE" title="How the app connects data to viewing" />
        <ol className="sequence-grid sequence-wide">
          {sequence.map((item) => (
            <li key={item.label}>
              <samp>{item.label}</samp>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="warning-band">
        <samp>[ ACCURACY NOTICE ]</samp>
        <p>
          Satellite positions, pass predictions, maps, and AR pointing are estimates. Live Orbit is not for navigation, collision avoidance, satellite control, emergency operations, or safety-critical use.
        </p>
      </section>
    </>
  );
}
