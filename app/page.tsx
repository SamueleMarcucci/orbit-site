import Link from "next/link";
import { LaunchLink } from "@/components/launch-link";
import { OrbitPlate } from "@/components/orbit-plate";
import { SectionLabel } from "@/components/section-label";
import { capabilityCells, sequence, systemFacts, trustLedger } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="hero-grid">
        <div className="hero-copy">
          <samp className="eyebrow">[ PRELAUNCH FIELD SYSTEM ]</samp>
          <h1>Live Orbit</h1>
          <p>
            Satellite tracking for iPhone, built for people who want the sky to make sense without pretending orbital data is simpler than it is.
          </p>
          <div className="hero-actions">
            <LaunchLink />
            <Link className="secondary-link" href="/features/">
              Read feature manifest
            </Link>
          </div>
        </div>
        <OrbitPlate />
        <dl className="status-strip" aria-label="Launch status">
          {systemFacts.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="proof-bar" aria-label="Product proof">
        <span>No account required</span>
        <span>Location only with iOS permission</span>
        <span>Public orbital elements</span>
        <span>Not for safety-critical use</span>
      </section>

      <section className="section-block" id="features">
        <SectionLabel code="OPS/MODULES" title="What the app is being built to do" />
        <div className="capability-grid">
          {capabilityCells.map((cell) => (
            <article className={`capability-cell ${cell.span}`} key={cell.code}>
              <samp>{cell.code}</samp>
              <h3>{cell.title}</h3>
              <p>{cell.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionLabel code="FLOW/READING" title="From catalog to sky" />
        <ol className="sequence-grid">
          {sequence.map((item) => (
            <li key={item.label}>
              <samp>{item.label}</samp>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block split-ledger">
        <div>
          <SectionLabel code="TRUST/PROTOCOL" title="Launch site rules" />
          <p className="section-copy">
            The website uses the local app as source of truth. It does not pad the story with fake activity, fake store status, or fake catalog statistics.
          </p>
        </div>
        <dl className="trust-ledger">
          {trustLedger.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="launch-panel">
        <samp>[ LAUNCH CHANNEL ]</samp>
        <h2>Join before release notes start moving.</h2>
        <p>
          Live Orbit is not publicly downloadable yet. Use the launch list for release timing, TestFlight news if available later, and product updates from {site.supportEmail}.
        </p>
        <LaunchLink label="Request launch notice" />
      </section>
    </>
  );
}
