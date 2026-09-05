import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, guideDate } from "@/lib/guides";
import { breadcrumbJsonLd, canonical, JsonLd, pageMetadata } from "@/lib/seo";
import { site, socialPreviewImage } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({slug})=>({slug})); }
type Props = { params: Promise<{slug:string}> };
export async function generateMetadata({params}:Props) {
  const {slug}=await params; const guide=guides.find(g=>g.slug===slug); if(!guide)notFound();
  const metadata=pageMetadata({title:guide.title,description:guide.description,path:`/guides/${slug}/`});
  return {...metadata,openGraph:{...metadata.openGraph,type:"article",publishedTime:guideDate,modifiedTime:guideDate,authors:["https://appsmadebetter.com/about/"]}};
}
export default async function GuidePage({params}:Props) {
  const {slug}=await params; const guide=guides.find(g=>g.slug===slug); if(!guide)notFound();
  const url=canonical(`/guides/${slug}/`);
  return <article className="guide-article wrap">
    <JsonLd data={[breadcrumbJsonLd([{name:"Live Orbit",path:"/"},{name:"Guides",path:"/guides/"},{name:guide.title,path:`/guides/${slug}/`}]),{"@type":"Article","@id":`${url}#article`,url,mainEntityOfPage:url,headline:guide.title,description:guide.description,inLanguage:"en",image:`${site.url}${socialPreviewImage}`,author:{"@type":"Organization",name:"Apps Made Better LLC",url:"https://appsmadebetter.com/about/"},publisher:{"@id":"https://appsmadebetter.com/#organization"},datePublished:guideDate,dateModified:guideDate,citation:guide.sources.map(source=>source.url)}]} />
    <nav className="guide-breadcrumb" aria-label="Breadcrumb"><Link href="/">Live Orbit</Link><span aria-hidden="true">/</span><Link href="/guides/">Guides</Link></nav>
    <header><p className="eyebrow">SATELLITE TRACKING GUIDE</p><h1>{guide.title}</h1><p className="guide-summary">{guide.summary}</p><p className="guide-byline">By <a href="https://appsmadebetter.com/about/">Apps Made Better LLC</a> · <time dateTime={guideDate}>September 5, 2026</time></p></header>
    <div className="guide-body">{guide.sections.map((section,index)=><section key={section.title} aria-labelledby={`section-${index}`}><h2 id={`section-${index}`}>{section.title}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.steps&&<ol>{section.steps.map(step=><li key={step}>{step}</li>)}</ol>}</section>)}
      <section className="guide-sources"><h2>Sources and further reading</h2><ul>{guide.sources.map(source=><li key={source.url}><a href={source.url}>{source.name}</a></li>)}</ul></section>
      <aside className="guide-next"><h2>Keep exploring</h2>{guides.filter(g=>g.slug!==slug).map(g=><Link key={g.slug} href={`/guides/${g.slug}/`}>{g.title} <span aria-hidden="true">→</span></Link>)}<Link href="/support/">Get help with Live Orbit <span aria-hidden="true">→</span></Link></aside>
      <div className="guide-download"><a className="download-button" href={site.appStoreUrl} data-analytics-event="app_store_cta_click" data-analytics-label={`Guide: ${slug}`}>Download for iOS</a><p>Live Orbit for iPhone. Free with in-app purchases.</p></div>
    </div>
  </article>;
}
