import type { Metadata } from "next";
import Link from "next/link";
import { SupportContactForm } from "@/components/support-contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Live Orbit support and join the launch list."
};

export default function SupportPage() {
  return (
    <article className="minimal-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Support</h1>
        <p>Get help, report an issue, or reach out about Live Orbit.</p>
      </header>

      <section>
        <h2>Contact support</h2>
        <SupportContactForm />
      </section>

      <section>
        <h2>Email</h2>
        <p>
          You can also write directly to <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
        </p>
      </section>

      <section>
        <h2>Helpful details</h2>
        <p>If something is broken, include what you were trying to do, what happened, and what you expected to happen.</p>
        <p>Do not send passwords, API keys, or exact location unless you intentionally choose to include it.</p>
      </section>
    </article>
  );
}
