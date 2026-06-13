import Image from "next/image";
import Link from "next/link";
import { homeFeatureCards, homepageFaq } from "@/lib/content";
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
    alt: "Live Orbit Sky Mode iPhone mockup"
  }
];

export default function HomePage() {
  return (
    <section className="download-landing" aria-labelledby="download-title">
      <div className="download-brand">
        <Image
          src={assetPath("/assets/live-orbit-app-icon.png")}
          alt="Live Orbit app icon"
          width={132}
          height={132}
          priority
        />
        <h1 id="download-title">Live Orbit</h1>
        <p className="promise-line">Track satellites live from your iPhone.</p>
        <p className="platform-line">Built for iPhone</p>
        <Link className="download-button" href="/testing/">
          Apply for TestFlight
        </Link>
      </div>

      <div className="download-screenshots" aria-label="Live Orbit screenshots">
        {screenshots.map((screenshot) => (
          <Image
            key={screenshot.src}
            src={assetPath(screenshot.src)}
            alt={screenshot.alt}
            width={2200}
            height={4498}
            priority
          />
        ))}
      </div>

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
        <div className="home-faq-list">
          {homepageFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <div className="faq-answer">
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className="download-footer">
        <p>© 2026 Apps Made Better LLC</p>
        <nav aria-label="Footer">
          <a href="/support/">Support</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
        </nav>
      </footer>
    </section>
  );
}
