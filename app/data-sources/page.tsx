import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { dataSourceSections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Data Sources",
  description: "Live Orbit data source credits for satellite data, reference data, maps, and imagery."
};

export default function DataSourcesPage() {
  return (
    <>
      <PageHero
        code="SOURCE/LEDGER"
        title="Credits belong in the interface."
        body="The app lists the source families below. The website mirrors those credits instead of inventing authority."
      />
      <section className="source-ledger">
        {dataSourceSections.map((section) => (
          <div className="source-section" key={section.title}>
            <header>
              <h2>{section.title}</h2>
              <p>{section.note}</p>
            </header>
            <div className="source-table" role="table" aria-label={section.title}>
              {section.items.map(([name, data, use]) => (
                <article role="row" key={name}>
                  <h3 role="cell">{name}</h3>
                  <p role="cell">{data}</p>
                  <samp role="cell">{use}</samp>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
