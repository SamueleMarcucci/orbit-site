import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Download Live Orbit",
  description: "Download Live Orbit from the App Store.",
  path: "/testing/thanks",
  noindex: true,
});

export default function TestingThanksPage() {
  return (
    <article className="minimal-page thanks-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Live Orbit is available.</h1>
        <p>Download Live Orbit from the App Store for iPhone.</p>
      </header>

      <section className="thanks-actions">
        <a href="https://apps.apple.com/us/app/live-orbit/id6794325315">Download the App</a>
        <Link href="/support/" prefetch={false}>Contact support</Link>
      </section>
    </article>
  );
}
