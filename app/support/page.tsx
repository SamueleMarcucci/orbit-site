import type { Metadata } from "next";
import Link from "next/link";
import { SupportContactForm } from "@/components/support-contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Live Orbit support and join the launch list."
};

const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${site.companyEmail}&su=${encodeURIComponent("Live Orbit support")}`;

export default function SupportPage() {
  return (
    <article className="minimal-page form-page support-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>Support</h1>
        <p>Choose what you need help with, add your email, and send it directly to Apps Made Better LLC.</p>
      </header>

      <section className="form-card">
        <h2>Contact support</h2>
        <SupportContactForm />
      </section>

      <section className="support-direct">
        <h2>Direct email</h2>
        <p>You can also write directly to {site.companyEmail}.</p>
        <div className="support-direct-links">
          <a href={`mailto:${site.companyEmail}?subject=${encodeURIComponent("Live Orbit support")}`}>Open in Mail</a>
          <a href={gmailHref} target="_blank" rel="noreferrer">Open in Gmail</a>
        </div>
      </section>

      <section className="support-details">
        <h2>Helpful details</h2>
        <p>If something is broken, include what you were trying to do, what happened, and what you expected to happen.</p>
        <p>Do not send passwords, API keys, or exact location unless you intentionally choose to include it.</p>
      </section>
    </article>
  );
}
