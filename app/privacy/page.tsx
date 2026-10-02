import type { Metadata } from "next";
import Link from "next/link";
import privacyPolicy from "@/lib/privacy-policy.json";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "Live Orbit privacy policy for App Store privacy labels, location, analytics, diagnostics, support, purchases, identifiers, and local app data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="minimal-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Privacy", path: "/privacy" }])} />
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Privacy</h1>
        <p>Live Orbit is an iOS-only satellite watching app from Apps Made Better LLC. No account is required.</p>
      </header>

      <div className="minimal-ledger">
        {privacyPolicy.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>
    </article>
  );
}
