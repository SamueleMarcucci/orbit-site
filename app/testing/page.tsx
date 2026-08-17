import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Download Live Orbit",
  description: "Download Live Orbit from the App Store.",
  path: "/testing",
  noindex: true,
});

export default function TestingPage() {
  return (
    <article className="minimal-page form-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Download Live Orbit", path: "/testing" }])} />
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Download Live Orbit</h1>
        <p>Live Orbit is available on the App Store for iPhone.</p>
      </header>

      <section className="form-card">
        <a className="download-button" href={site.appStoreUrl}>Download the App</a>
      </section>
    </article>
  );
}
