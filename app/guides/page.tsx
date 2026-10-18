import Link from "next/link";
import { guideCategories, guides } from "@/lib/guides";
import { breadcrumbJsonLd, canonical, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Satellite Tracking & Observing Guides", path: "/guides/", description: "Learn satellite tracking on iPhone and iPad: ISS sightings, Starlink, Sky Mode, orbital data, radio recordings, and a printable observing checklist." });
export default function GuidesPage() {
  return <div className="guide-index wrap">
    <JsonLd data={[breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Guides", path: "/guides/" }]), { "@type": "CollectionPage", "@id": `${canonical("/guides/")}#collection`, url: canonical("/guides/"), name: "Satellite tracking and observing guides", isPartOf: { "@id": "https://www.liveorbitapp.com/#website" }, mainEntity: { "@type": "ItemList", itemListElement: guides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: canonical(`/guides/${guide.slug}/`) })) } }]} />
    <header><p className="eyebrow">LIVE ORBIT GUIDES</p><h1>Satellite tracking.<br /><span>From the globe to your sky.</span></h1><p>Practical guides for iPhone and iPad, from your first satellite search to an observing session. Written by Apps Made Better, the publisher of Live Orbit, with links to the sources behind the explanation.</p></header>
    <section className="guide-contents" aria-labelledby="visibility-tool-title"><h2 id="visibility-tool-title">Why can’t I see the satellite?</h2><p>Try a simple illustration of horizon, sunlight, and observer darkness before planning your next pass.</p><Link href="/tools/satellite-visibility/">Explore the satellite visibility lab <span aria-hidden="true">→</span></Link></section>
    <nav className="guide-contents" aria-label="Guide topics"><p>Explore by topic</p><ul>{guideCategories.map((category, index) => <li key={category}><a href={`#category-${index}`}>{category}</a></li>)}</ul></nav>
    {guideCategories.map((category, categoryIndex) => <section className="guide-category" key={category} aria-labelledby={`category-${categoryIndex}`}><h2 id={`category-${categoryIndex}`}>{category}</h2><div className="guide-list">{guides.filter(guide => guide.category === category).map(guide => <article key={guide.slug}><div><h3><Link href={`/guides/${guide.slug}/`}>{guide.title} <span aria-hidden="true">↗</span></Link></h3><p>{guide.description}</p></div></article>)}</div></section>)}
    <Link className="text-link" href="/features/">Explore Live Orbit features <span aria-hidden="true">→</span></Link>
  </div>;
}
