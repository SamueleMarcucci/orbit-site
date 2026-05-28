import type { Metadata } from "next";
import Image from "next/image";
import { LaunchLink } from "@/components/launch-link";
import { PageHero } from "@/components/page-hero";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Live Orbit, a prelaunch iPhone satellite tracking app."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        code="ABOUT/ORIGIN"
        title="A satellite app built from the app outward."
        body="The website is shaped from the local Live Orbit app: globe, passes, Sky Mode, insights, news, privacy, and credits."
      />
      <section className="about-panel">
        <div>
          <Image src={assetPath("/assets/live-orbit-icon.png")} alt="Live Orbit app icon" width={132} height={132} priority />
        </div>
        <div>
          <h2>Launch story</h2>
          <p>
            Live Orbit is being built as an iPhone-first way to understand what is overhead. The product starts with the globe, then connects search, satellite detail, visible pass planning, Sky Mode, insights, and news into one consistent app.
          </p>
          <p>
            The app is not on the App Store yet. The launch list is the public channel until a real launch URL exists.
          </p>
          <LaunchLink />
        </div>
      </section>
    </>
  );
}
