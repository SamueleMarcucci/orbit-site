import Image from "next/image";
import { assetPath } from "@/lib/site";

const screenshots = [
  {
    src: "/assets/app-store-loa/group-18.jpg",
    alt: "Live Orbit iPhone app screenshot"
  },
  {
    src: "/assets/app-store-loa/group-19.jpg",
    alt: "Live Orbit iPhone app screenshot"
  }
];

export default function HomePage() {
  return (
    <section className="download-landing" aria-labelledby="download-title">
      <div className="download-brand">
        <Image
          src={assetPath("/assets/live-orbit-icon.png")}
          alt="Live Orbit app icon"
          width={132}
          height={132}
          priority
        />
        <h1 id="download-title">Live Orbit</h1>
        <a className="download-button" href="https://apps.apple.com/app/id6766396809" aria-label="Download Live Orbit on the App Store">
          Download
        </a>
      </div>

      <div className="download-screenshots" aria-label="Live Orbit screenshots">
        {screenshots.map((screenshot) => (
          <Image
            key={screenshot.src}
            src={assetPath(screenshot.src)}
            alt={screenshot.alt}
            width={1242}
            height={2688}
            priority
          />
        ))}
      </div>
    </section>
  );
}
