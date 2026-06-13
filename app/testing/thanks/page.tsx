import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application Sent",
  description: "Your Live Orbit TestFlight application was submitted."
};

export default function TestingThanksPage() {
  return (
    <article className="minimal-page thanks-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Application sent.</h1>
        <p>Thanks for applying to test Live Orbit. If there is room in TestFlight, you will hear back by email.</p>
      </header>

      <section className="thanks-actions">
        <Link href="/" prefetch={false}>Back to Live Orbit</Link>
        <Link href="/support/" prefetch={false}>Contact support</Link>
      </section>
    </article>
  );
}
