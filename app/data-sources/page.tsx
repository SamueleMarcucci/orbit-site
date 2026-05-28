import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { dataSourceSections } from "@/lib/content";

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
        <div className="space-y-14">
          {dataSourceSections.map((section) => (
            <section key={section.title} aria-labelledby={`${section.title.toLowerCase().replaceAll(" ", "-")}-heading`}>
              <div className="mb-5 max-w-2xl">
                <h2 id={`${section.title.toLowerCase().replaceAll(" ", "-")}-heading`} className="text-3xl font-semibold tracking-[-0.05em] text-[var(--text)]">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{section.subtitle}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((source) => (
                  <Reveal key={source.name}>
                    <article className="surface-shell">
                      <div className="surface-core min-h-52 p-6">
                        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{source.name}</h3>
                        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{source.data}</p>
                        <p className="mt-4 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--green)]">{source.use}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
