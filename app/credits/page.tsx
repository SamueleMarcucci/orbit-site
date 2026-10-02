import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Data credits",
  description: "GCAT satellite metadata attribution and license information for Live Orbit.",
  path: "/credits",
});

export default function CreditsPage() {
  return (
    <article className="minimal-page">
      <header><Link href="/" prefetch={false}>Live Orbit</Link><h1>Data credits</h1></header>
      <div className="minimal-ledger">
        <section>
          <h2>Jonathan McDowell / GCAT</h2>
          <p>Live Orbit uses the <a href="https://planet4589.org/space/gcat/index.html">General Catalog of Artificial Space Objects (GCAT)</a> by Jonathan McDowell for available satellite names, launch details, ownership, manufacturers, spacecraft platforms, and mission classifications.</p>
          <p>© 2020–2026 Jonathan McDowell. Licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International (CC BY 4.0)</a>.</p>
          <p>Modified by Live Orbit: fields are normalized, exact object and launch identifiers are matched, records are combined with other catalogs, and data is compressed for delivery. Uncertainty labels are retained. No endorsement is implied.</p>
        </section>
        <section>
          <h2>Other sources</h2>
          <p>Live Orbit also uses <a href="https://www.space-track.org">Space-Track.org</a>, <a href="https://celestrak.org">CelesTrak</a>, and other providers. See Settings → Data Sources in the app for the full source list and additional notices. The GCAT license applies to GCAT data, not to every data source or to the app itself.</p>
        </section>
      </div>
    </article>
  );
}
