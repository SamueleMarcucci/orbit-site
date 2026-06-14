import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Message Sent",
  description: "Your Live Orbit support message was submitted.",
  path: "/support/thanks",
  noindex: true,
});

export default function SupportThanksPage() {
  return (
    <article className="minimal-page thanks-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Message sent.</h1>
        <p>Thanks for reaching out. Your message was sent to Apps Made Better LLC.</p>
      </header>

      <section className="thanks-actions">
        <Link href="/" prefetch={false}>Back to Live Orbit</Link>
        <Link href="/support/" prefetch={false}>Send another message</Link>
      </section>
    </article>
  );
}
