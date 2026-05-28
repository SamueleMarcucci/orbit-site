import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { dataSources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Data Sources",
  description: "Data source credits and trust notes for Live Orbit."
};

export default function DataSourcesPage() {
  return (
    <>
      <PageHero
        title="Data credits matter when the product is about the sky."
        body="Live Orbit presents public orbital data and catalog context through a polished iPhone experience. These are the source families referenced by the app."
      />
      <section className="page-shell pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          {dataSources.map((source) => (
            <Reveal key={source.name}>
              <article className="surface-shell">
                <div className="surface-core min-h-48 p-6">
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{source.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{source.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
