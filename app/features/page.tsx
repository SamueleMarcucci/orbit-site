import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SectionLabel } from "@/components/section-label";
import { capabilityCells, sequence } from "@/lib/content";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description: "Live Orbit feature manifest for globe tracking, pass predictions, Sky Mode, search, insights, and news.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Features", path: "/features" }])} />
      <PageHero
        code="FEATURE/MANIFEST"
        title="A field instrument, not a fake command center."
        body="These features come from the local Live Orbit app surfaces: globe, satellite details, search, passes, Sky Mode, insights, news, privacy, and trusted data."
      />

      <section className="section-block">
        <SectionLabel code="MODULE/INDEX" title="Feature modules" />
        <div className="feature-ledger">
          {capabilityCells.map((cell) => (
            <article key={cell.code}>
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
        <samp>Accuracy notice</samp>
        <p>
          Satellite positions, pass predictions, maps, and AR pointing are estimates. Live Orbit is not for navigation, collision avoidance, satellite control, emergency operations, or safety-critical use.
        </p>
      </section>
    </>
  );
}
