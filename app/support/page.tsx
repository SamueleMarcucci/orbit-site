import type { Metadata } from "next";
import { LaunchLink } from "@/components/launch-link";
import { PageHero } from "@/components/page-hero";
import { supportTopics } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Live Orbit support and join the launch list."
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        code="SUPPORT/CHANNEL"
        title="One public address until launch."
        body="Use support for bugs, launch timing, satellite data questions, feature requests, and future Pro questions."
      />
      <section className="support-grid">
        <div className="support-primary">
          <samp>Mail route</samp>
          <h2>{site.supportEmail}</h2>
          <p>
            Include your device model, iOS version, what you expected, and what happened. Do not send private credentials, API keys, or exact location unless you intentionally choose to include it.
          </p>
          <LaunchLink label="Email launch list" />
        </div>
        <ul className="topic-list">
          {supportTopics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
