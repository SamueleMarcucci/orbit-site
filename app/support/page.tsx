import type { Metadata } from "next";
import Link from "next/link";
import { supportPaths } from "@/lib/content";
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
        <h2>Choose a path</h2>
        <div className="support-paths">
          {supportPaths.map((path) => (
            <a key={path.subject} href={`mailto:${site.supportEmail}?subject=${encodeURIComponent(path.subject)}`}>
              <strong>{path.title}</strong>
              <span>{path.body}</span>
            </a>
          ))}
        </div>
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
