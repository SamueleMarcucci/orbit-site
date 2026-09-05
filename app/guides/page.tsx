import Link from "next/link";
import { guides } from "@/lib/guides";
import { breadcrumbJsonLd, canonical, JsonLd, pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({title:"Satellite Tracking Guides for iPhone",path:"/guides/",description:"Practical satellite tracking guides from Live Orbit: get started on iPhone, plan an ISS sighting, and understand visible satellite passes."});
export default function GuidesPage() {
  return <div className="guide-index wrap">
    <JsonLd data={[breadcrumbJsonLd([{name:"Live Orbit",path:"/"},{name:"Guides",path:"/guides/"}]),{"@type":"CollectionPage",url:canonical("/guides/"),name:"Satellite tracking guides",mainEntity:{"@type":"ItemList",itemListElement:guides.map((guide,index)=>({"@type":"ListItem",position:index+1,name:guide.title,url:canonical(`/guides/${guide.slug}/`)}))}}]} />
    <header><p className="eyebrow">LIVE ORBIT GUIDES</p><h1>Satellite tracking.<br /><span>A guide to getting started.</span></h1><p>Satellite tracking, from your first search to your next visible pass. Practical guides from Apps Made Better, the publisher of Live Orbit.</p></header>
    <div className="guide-list">{guides.map((guide,index)=><article key={guide.slug}><span className="eyebrow">0{index+1}</span><div><h2><Link href={`/guides/${guide.slug}/`}>{guide.title} <span aria-hidden="true">↗</span></Link></h2><p>{guide.description}</p></div></article>)}</div>
    <Link className="text-link" href="/">Explore Live Orbit <span aria-hidden="true">→</span></Link>
  </div>;
}
