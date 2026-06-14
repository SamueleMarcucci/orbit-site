import type { Metadata } from "next";
import Image from "next/image";
import { LaunchLink } from "@/components/launch-link";
import { PageHero } from "@/components/page-hero";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "About Live Orbit, a prelaunch iPhone satellite tracking app.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        code="ABOUT/ORIGIN"
        title="Built from the app outward."
        body="The website is shaped from the local Live Orbit app: globe, passes, Sky Mode, insights, news, privacy, and credits."
      />
      <section className="about-panel">
        <div>
          <Image src={assetPath("/assets/live-orbit-app-icon.png")} alt="Live Orbit app icon" width={132} height={132} priority />
        </div>
        <div>
          <h2>Launch story</h2>
          <p>
            Live Orbit is being built as an iPhone-first way to understand what is overhead. The product starts with the globe, then connects search, satellite detail, visible pass planning, Sky Mode, insights, and news into one consistent app.
          </p>
          <p>
            The app is not publicly available yet. The launch list is the public channel until a real launch URL exists.
          </p>
          <LaunchLink />
        </div>
      </section>
    </>
  );
}
