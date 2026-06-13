import type { Metadata } from "next";
import Link from "next/link";
import { TestingApplicationForm } from "@/components/testing-application-form";

export const metadata: Metadata = {
  title: "TestFlight",
  description: "Apply to test Live Orbit before launch."
};

export default function TestingPage() {
  return (
    <article className="minimal-page form-page">
      <header>
        <Link href="/" prefetch={false}>Live Orbit</Link>
        <h1>TestFlight</h1>
        <p>Apply to test Live Orbit before launch. The form opens an email draft so your application goes directly to Apps Made Better LLC.</p>
      </header>

      <section>
        <h2>Tester application</h2>
        <TestingApplicationForm />
      </section>
    </article>
  );
}
