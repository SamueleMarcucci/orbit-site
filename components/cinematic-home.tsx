"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitalCanvas } from "@/components/orbital-canvas";
import { assetPath, launchHref, site } from "@/lib/site";

const truths = ["Prelaunch only", "No account required", "Location by iOS permission", "Not for navigation"];

const revealWords = "A satellite pass becomes real when the sky has direction, time, and a reason to look up.".split(" ");

const quietFeatures = [
  ["Live globe", "A spatial home for satellites, orbit paths, and object detail."],
  ["Pass predictions", "Visible windows, peak context, and timing shaped around your location permission."],
  ["Sky Mode and AR", "Phone pointing for awareness, handled as an estimate with clear limits."],
  ["Search and insights", "Names, aliases, NORAD IDs, news, and readable catalog context."]
];

export function CinematicHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const storyProgressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return undefined;

    if (reduce) {
      storyProgressRef.current = 0.72;
      root.classList.add("reduced-motion-home");
      return () => root.classList.remove("reduced-motion-home");
    }

    const context = gsap.context(() => {
      gsap.from(".cinema-nav", {
        y: -24,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out"
      });

      gsap.from(".hero-word", {
        yPercent: 112,
        opacity: 0,
        duration: 1.18,
        stagger: 0.065,
        ease: "power4.out"
      });

      gsap.from(".hero-support, .hero-actions, .hero-proof", {
        y: 34,
        opacity: 0,
        duration: 1.0,
        stagger: 0.12,
        delay: 0.3,
        ease: "power3.out"
      });

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: ".orbit-story",
          start: "top top",
          end: "+=330%",
          scrub: 0.85,
          pin: ".story-stage",
          anticipatePin: 1,
          onUpdate: (self) => {
            storyProgressRef.current = self.progress;
          }
        }
      });

      story
        .fromTo(".story-caption-one", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.22, ease: "none" }, 0.08)
        .to(".story-caption-one", { opacity: 0, y: -44, duration: 0.18, ease: "none" }, 0.34)
        .fromTo(".story-caption-two", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.22, ease: "none" }, 0.42)
        .to(".story-caption-two", { opacity: 0, y: -44, duration: 0.18, ease: "none" }, 0.68)
        .fromTo(".story-caption-three", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.22, ease: "none" }, 0.76);

      gsap.fromTo(
        ".reveal-word",
        { opacity: 0.12, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: ".word-reveal",
            start: "top 72%",
            end: "bottom 44%",
            scrub: 0.75
          }
        }
      );

      gsap.utils.toArray<HTMLElement>(".cinematic-rise").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 54, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              once: true
            }
          }
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div className="cinematic-home" ref={rootRef}>
      <nav className="cinema-nav" aria-label="Live Orbit">
        <a href="#top" className="cinema-brand">
          <Image src={assetPath("/assets/live-orbit-app-icon.png")} alt="" width={34} height={34} priority />
          <span>Live Orbit</span>
        </a>
        <div>
          <a href="/features/">Features</a>
          <a href="/data-sources/">Data</a>
          <a href={launchHref}>Join</a>
        </div>
      </nav>

      <section className="cinema-hero" id="top" aria-labelledby="cinema-title">
        <OrbitalCanvas mode="hero" className="orbital-canvas hero-canvas" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-copy-shell">
          <p className="cinema-kicker">Prelaunch iPhone satellite tracking</p>
          <h1 id="cinema-title" aria-label="Watch the sky move.">
            <span className="hero-line" aria-hidden="true">
              <span className="hero-word">Watch</span>{" "}
              <span className="hero-word">the</span>
            </span>
            <span className="hero-line" aria-hidden="true">
              <span className="hero-word">sky</span>{" "}
              <span className="hero-word">move.</span>
            </span>
          </h1>
          <p className="hero-support">
            Live Orbit turns public orbital data into a calm way to find satellites, understand visible passes, and point your phone at the right part of the sky.
          </p>
          <div className="hero-actions">
            <a className="cinema-button cinema-button-primary" href={launchHref}>
              Join the launch list
              <span aria-hidden="true">-&gt;</span>
            </a>
            <a className="cinema-button cinema-button-quiet" href="/features/">
              See what it does
            </a>
          </div>
          <ul className="hero-proof" aria-label="Product truths">
            {truths.map((truth) => (
              <li key={truth}>{truth}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="word-reveal" aria-label="Live Orbit positioning">
        <p aria-label="A satellite pass becomes real when the sky has direction, time, and a reason to look up.">
          {revealWords.map((word, index) => (
            <span aria-hidden="true" className="reveal-word" key={`${word}-${index}`}>
              {word}
            </span>
          ))}
        </p>
      </section>

      <section className="feature-silence" aria-label="Product proof">
        <div className="feature-silence-copy cinematic-rise">
          <p className="cinema-kicker">Built from the app outward</p>
          <h2>No fake telemetry. No store claim. No filler graphics.</h2>
        </div>
        <div className="quiet-feature-list">
          {quietFeatures.map(([title, body]) => (
            <article className="cinematic-rise" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="orbit-story" aria-label="Scroll story">
        <div className="story-stage">
          <OrbitalCanvas mode="story" progressSource={storyProgressRef} className="orbital-canvas story-canvas" />
          <div className="story-caption story-caption-one">
            <p>Search</p>
            <h2>Start with the object.</h2>
            <span>Find satellites and read the details without invented activity, fake counts, or inflated mission language.</span>
          </div>
          <div className="story-caption story-caption-two">
            <p>Pass prediction</p>
            <h2>Then the sky gets a window.</h2>
            <span>Visible passes depend on time, observer location, public orbital elements, and honest estimate limits.</span>
          </div>
          <div className="story-caption story-caption-three">
            <p>Sky Mode</p>
            <h2>Point, then follow.</h2>
            <span>AR and device pointing are permission-based awareness tools, not navigation, control, or safety-critical guidance.</span>
          </div>
        </div>
      </section>

      <section className="instrument-section">
        <OrbitalCanvas mode="ambient" className="orbital-canvas section-canvas" />
        <div className="instrument-copy cinematic-rise">
          <p className="cinema-kicker">Beginner to orbitalist</p>
          <h2>The interface should get out of the way.</h2>
          <p>
            The app gives beginners a clear next look-up moment, then leaves room for deeper orbit context: search, object sheets, insights, news, and trusted source credits.
          </p>
        </div>
      </section>

      <section className="trust-cinematic">
        <div className="trust-copy cinematic-rise">
          <p className="cinema-kicker">Data trust</p>
          <h2>Authority has to be earned quietly.</h2>
          <p>
            Live Orbit uses public orbital elements, app-side cached catalog data, iOS location permission, privacy-safe diagnostics, and clear limits for maps, passes, and AR pointing.
          </p>
          <a className="cinema-text-link" href="/data-sources/">Read the data sources</a>
        </div>
        <div className="trust-lines cinematic-rise" aria-label="Trust notes">
          <p>No account required</p>
          <p>Public orbital data</p>
          <p>Cached catalog data</p>
          <p>Estimates, not operational guidance</p>
        </div>
      </section>

      <section className="final-cinematic" aria-labelledby="final-title">
        <OrbitalCanvas mode="final" className="orbital-canvas final-canvas" />
        <div className="final-copy cinematic-rise">
          <p className="cinema-kicker">Live Orbit is prelaunch</p>
          <h2 id="final-title">Be there when the release window opens.</h2>
          <p>Join the launch list for release timing, TestFlight news if available later, and product updates from {site.supportEmail}.</p>
          <a className="cinema-button cinema-button-primary" href={launchHref}>
            Join the launch list
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </section>
    </div>
  );
}
