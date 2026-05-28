import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <samp>[ 404 / NO SIGNAL ]</samp>
      <h1>Vector not found.</h1>
      <p>The requested route is not part of the Live Orbit launch site.</p>
      <Link className="secondary-link" href="/">
        Return to base
      </Link>
    </section>
  );
}
