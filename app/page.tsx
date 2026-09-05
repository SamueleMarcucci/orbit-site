import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeFaqList } from "@/components/home-faq-list";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { homepageFaq } from "@/lib/content";
import { faqJsonLd, JsonLd, pageMetadata, softwareJsonLd } from "@/lib/seo";
import { assetPath, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ description: "Live Orbit is a satellite tracker for iPhone. Track satellites and the ISS, plan visible passes, and explore the sky with Sky Mode. Free with in-app purchases." });

export default function HomePage() {
  return (
    <div className="orbit-home">
      <JsonLd data={[softwareJsonLd(), faqJsonLd(homepageFaq)]} />
      <section className="orbit-hero" aria-labelledby="hero-title">
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span className="orange-dot" aria-hidden="true" /> SATELLITE TRACKING, MADE FOR IPHONE</p>
            <h1 id="hero-title">Look up.<br /><span>There’s more.</span></h1>
            <p className="hero-description">That little light has a whole story.<br />Follow satellites, find your next visible pass,<br className="desktop-break" /> and get to know the sky above you.</p>
            <div className="actions"><a className="download-button" href={site.appStoreUrl} data-analytics-event="app_store_cta_click" data-analytics-label="Hero download">Download for iOS</a><a className="text-link" href="#discover">Meet Live Orbit <span aria-hidden="true">↓</span></a></div>
            <p className="availability">For iPhone. Free with in-app purchases.</p>
          </div>
          <div className="hero-art hero-art--single">
            <picture><source srcSet={[480, 960, 1440].map(width => `${assetPath(`/assets/september/hand-earth-updated-${width}.avif`)} ${width}w`).join(", ")} sizes="(max-width: 700px) 90vw, 600px" type="image/avif" /><source srcSet={`${assetPath('/assets/september/hand-earth-updated-700.webp')} 700w, ${assetPath('/assets/september/hand-earth-updated-1400.webp')} 1400w`} sizes="(max-width: 700px) 90vw, 600px" type="image/webp" /><img src={assetPath('/assets/september/hand-earth-updated-1400.webp')} alt="Live Orbit’s Earth view on an iPhone held in your hand" width={4636} height={5834} fetchPriority="high" /></picture>
          </div>
        </div>
      </section>

      <section className="discover-section wrap" id="discover" aria-labelledby="discover-title">
        <p className="eyebrow">YOUR EVERYDAY, WITH A LITTLE MORE SPACE</p>
        <h2 id="discover-title">The sky is full of stories.<br /><span>Now you can follow them.</span></h2>
        <p>Live Orbit is a satellite tracking app for iPhone.<br className="desktop-break" /> Explore satellites and the ISS, plan visible passes,<br className="desktop-break" /> and find your way across the sky with Sky Mode.</p>
        <div className="feature-line"><span>Live satellite tracking</span><span>Visible pass planning</span><span>Sky Mode &amp; AR</span></div>
      </section>

      <ArtworkGallery />

      <section className="field-section field-section--text-only wrap" aria-labelledby="field-title">
        <div className="field-copy"><p className="eyebrow">FROM CURIOUS TO LOOKING UP</p><h2 id="field-title">A great view.<br /><span>And a way to find it.</span></h2><p>You don’t have to know the sky to start exploring it. Live Orbit helps you go from wondering what’s up there to knowing where to look.</p><ol className="field-steps"><li><span aria-hidden="true">01</span><div><h3>Find your next pass.</h3><p>See predicted timing, visibility, and where a satellite will cross your sky.</p></div></li><li><span aria-hidden="true">02</span><div><h3>Let your iPhone guide you.</h3><p>Use Sky Mode and AR to point toward a satellite from where you are.</p></div></li><li><span aria-hidden="true">03</span><div><h3>Follow the story.</h3><p>Explore satellite details, radio recordings, and the latest space news.</p></div></li></ol><p><Link className="text-link" href="/guides/">Explore satellite tracking guides <span aria-hidden="true">→</span></Link></p><a className="text-link" href={site.appStoreUrl}>Take it outside <span aria-hidden="true">↗</span></a></div>
      </section>

      <section className="download-section" aria-labelledby="download-title"><div className="wrap download-inner"><Image className="download-icon" src={assetPath('/assets/september/app-icon-192.png')} alt="" width={108} height={108} /><p className="eyebrow">LIVE ORBIT FOR IPHONE</p><h2 id="download-title">Your next discovery<br /><span>is right above you.</span></h2><p>Bring a little more space into your day.</p><a className="download-button" href={site.appStoreUrl} data-analytics-event="app_store_cta_click" data-analytics-label="Closing download">Download for iOS</a><p className="availability">Free to download. In-app purchases available.</p></div></section>

      <section className="faq-section wrap" aria-labelledby="faq-title"><div><p className="eyebrow">GOOD TO KNOW</p><h2 id="faq-title">A few things<br />you might wonder.</h2><p>Still have a question?</p><Link className="text-link" href="/support/">We’re here to help <span aria-hidden="true">↗</span></Link></div><HomeFaqList items={homepageFaq} /></section>
    </div>
  );
}
