import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeFaqList } from "@/components/home-faq-list";
import { ScreenshotCarousel } from "@/components/screenshot-carousel";
import { homeFeatureCards, homepageFaq } from "@/lib/content";
import { faqJsonLd, JsonLd, organizationJsonLd, pageMetadata, softwareJsonLd, websiteJsonLd } from "@/lib/seo";
import { assetPath } from "@/lib/site";

const screenshots = [
  {
    src: "/assets/app-store-loa/screen-earth.png",
    alt: "Live Orbit Earth view iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-passes.png",
    alt: "Live Orbit pass results iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-sky.png",
    alt: "Live Orbit space news iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-look-up.png",
    alt: "Live Orbit Sky Mode iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-deep-dive.png",
    alt: "Live Orbit satellite detail iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-beyond-earth.png",
    alt: "Live Orbit Moon Sun and Mars iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-radio.png",
    alt: "Live Orbit radio signals iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-events.png",
    alt: "Live Orbit space events iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-search.png",
    alt: "Live Orbit search filters iPhone mockup"
  },
  {
    src: "/assets/app-store-loa/screen-languages.png",
    alt: "Live Orbit language settings iPhone mockup"
  }
];

export const metadata: Metadata = pageMetadata({
  description: "A native iPhone app for live satellites, visible passes, Sky Mode, launches, space news, and trusted orbital context.",
});

export default function HomePage() {
  return (
    <section className="download-landing" aria-labelledby="download-title">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), softwareJsonLd(), faqJsonLd(homepageFaq)]} />
      <div className="download-brand">
        <Image
          src={assetPath("/assets/live-orbit-home-icon.png")}
          alt="Live Orbit app icon"
          width={132}
          height={132}
          priority
        />
        <h1 id="download-title">Live Orbit</h1>
        <p className="promise-line">Track satellites live from your iPhone.</p>
        <p className="platform-line">Built for iPhone</p>
        <Link className="download-button" href="/testing/" data-analytics-event="testflight_cta_click" data-analytics-label="Home Apply for TestFlight">
          Apply for TestFlight
        </Link>
        <p className="launch-note">Coming soon, expected in the next week or two.</p>
      </div>

      <ScreenshotCarousel screenshots={screenshots} />

      <section className="home-features" aria-labelledby="home-features-title">
        <div className="home-features-heading">
          <p>What it does</p>
          <h2 id="home-features-title">Know what’s above. And when to look.</h2>
        </div>
        <div className="home-feature-grid">
          {homeFeatureCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-faq" aria-labelledby="home-faq-title">
        <div className="home-faq-heading">
          <p>Good to know</p>
          <h2 id="home-faq-title">A few quick answers.</h2>
        </div>
        <HomeFaqList items={homepageFaq} />
      </section>

      <footer className="download-footer">
        <p>© 2026 Apps Made Better LLC</p>
        <nav aria-label="Footer">
          <a href="/support/" data-analytics-event="footer_support_click">Support</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
        </nav>
      </footer>
    </section>
  );
}
