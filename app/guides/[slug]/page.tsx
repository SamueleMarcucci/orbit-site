import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGuideDate, guides, relatedGuides } from "@/lib/guides";
import { breadcrumbJsonLd, canonical, JsonLd, pageMetadata } from "@/lib/seo";
import { assetPath, site, socialPreviewImage } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const metadata = pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${slug}/` });
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", ...(guide.publishedAt ? { publishedTime: guide.publishedAt } : {}), modifiedTime: guide.modifiedAt, authors: ["https://appsmadebetter.com/"] } };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const url = canonical(`/guides/${slug}/`);
  return <article className="guide-article wrap">
    <JsonLd data={[
      breadcrumbJsonLd([{ name: "Live Orbit", path: "/" }, { name: "Guides", path: "/guides/" }, { name: guide.title, path: `/guides/${slug}/` }]),
      { "@type": "Article", "@id": `${url}#article`, url, mainEntityOfPage: url, headline: guide.title, description: guide.description, inLanguage: "en", image: `${site.url}${guide.image?.path || socialPreviewImage}`, author: { "@type": "Organization", "@id": "https://appsmadebetter.com/#organization", name: "Apps Made Better LLC", url: "https://appsmadebetter.com/" }, publisher: { "@id": "https://appsmadebetter.com/#organization" }, ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}), dateModified: guide.modifiedAt, citation: guide.sources.map(source => source.url), about: { "@id": `${site.url}/#software` } },
    ]} />
    <nav className="guide-breadcrumb" aria-label="Breadcrumb"><Link href="/">Live Orbit</Link><span aria-hidden="true">/</span><Link href="/guides/">Guides</Link></nav>
    <header><p className="eyebrow">{guide.category.toUpperCase()}</p><h1>{guide.title}</h1><p className="guide-summary">{guide.summary}</p><p className="guide-byline">By <a href="https://appsmadebetter.com/">Apps Made Better LLC</a> · Reviewed <time dateTime={guide.reviewedAt}>{formatGuideDate(guide.reviewedAt)}</time></p></header>
    <nav className="guide-contents" aria-label="On this page"><p>On this page</p><ol>{guide.sections.map((section, index) => <li key={section.title}><a href={`#section-${index}`}>{section.title}</a></li>)}</ol></nav>
    <div className="guide-body">
      {guide.image && <figure className="guide-figure"><Image src={assetPath(guide.image.path)} alt={guide.image.alt} width={880} height={1905} sizes="(max-width: 700px) 90vw, 340px" /><figcaption>{guide.image.caption}</figcaption></figure>}
      {guide.sections.map((section, index) => <section key={section.title} aria-labelledby={`section-${index}`}>
        <h2 id={`section-${index}`}>{section.title}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.steps && <ol>{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
        {section.table && <div className="guide-table" tabIndex={0} role="region" aria-label={`${section.title} table`}><table><caption>{section.title}</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>}
        {section.links && <ul className="guide-context-links">{section.links.map(link => <li key={link.href}><Link href={link.href}>{link.label} <span aria-hidden="true">→</span></Link></li>)}</ul>}
      </section>)}
      <section className="guide-sources"><h2>Sources and further reading</h2><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url}>{source.name}</a></li>)}</ul></section>
      <aside className="guide-next" aria-labelledby="related-title"><h2 id="related-title">Keep exploring</h2>{relatedGuides(guide).map(item => <Link key={item.slug} href={`/guides/${item.slug}/`}>{item.title} <span aria-hidden="true">→</span></Link>)}<Link href="/guides/">All satellite tracking guides <span aria-hidden="true">→</span></Link><Link href="/features/">Live Orbit features <span aria-hidden="true">→</span></Link><Link href="/support/">Get help with Live Orbit <span aria-hidden="true">→</span></Link></aside>
      <div className="guide-download"><a className="download-button" href={site.appStoreUrl} data-analytics-event="app_store_cta_click" data-analytics-label={`Guide: ${slug}`}>Download on the App Store</a><p>Live Orbit for iPhone and iPad. Free with in-app purchases.</p></div>
    </div>
  </article>;
}
