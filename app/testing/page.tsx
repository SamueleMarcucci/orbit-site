import type { Metadata } from "next";
import Link from "next/link";
import { TestingApplicationForm } from "@/components/testing-application-form";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "TestFlight",
  description: "Apply to test Live Orbit before launch.",
  path: "/testing",
});

export default function TestingPage() {
  return (
    <article className="minimal-page form-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "TestFlight", path: "/testing" }])} />
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>TestFlight</h1>
        <p>Apply to test Live Orbit before launch. Submit the form and you will be taken to a confirmation page.</p>
      </header>

      <section className="form-card">
        <h2>Tester application</h2>
        <TestingApplicationForm />
      </section>
    </article>
  );
}
