import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Live Orbit support and join the launch list."
};

export default function SupportPage() {
  return (
    <article className="minimal-page">
      <header>
        <Link href="/">Live Orbit</Link>
        <h1>Support</h1>
        <p>Questions, bug reports, privacy requests, and launch support can go to one address.</p>
      </header>

      <section>
        <h2>Email</h2>
        <p>
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </p>
      </section>

      <section>
        <h2>What to include</h2>
        <p>Include your device model, iOS version, what you expected, and what happened.</p>
        <p>Do not send passwords, API keys, or exact location unless you intentionally choose to include it.</p>
      </section>
    </article>
  );
}
