import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="not-found">
      <Image src={assetPath("/assets/live-orbit-app-icon.png")} alt="Live Orbit app icon" width={104} height={104} priority />
      <samp>404</samp>
      <h1>Page not found.</h1>
      <p>This page does not exist, or the link has moved.</p>
      <div className="not-found-actions">
        <Link className="download-button" href="/">
          Back to Live Orbit
        </Link>
        <Link className="secondary-link" href="/support/">
          Contact support
        </Link>
      </div>
    </section>
  );
}
