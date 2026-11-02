import { APP_STORE, SITE, escapeHTML as e, eventPath, heroPath, jsonLd, modifiedAt, publishedAt, publishedEvents, watchStatus, type EventRecord } from "./model.ts";
import { styles } from "./styles.ts";

const organization = { "@type": "Organization", "@id": "https://appsmadebetter.com/#organization", name: "Apps Made Better LLC", url: "https://appsmadebetter.com/" };
const author = { "@type": "Organization", name: "Live Orbit", url: `${SITE}/`, parentOrganization: organization };
const date = (value: string, timezone = "America/New_York", options: Intl.DateTimeFormatOptions = {}) => new Intl.DateTimeFormat("en-US", { timeZone: timezone, month: "long", day: "numeric", year: "numeric", ...options }).format(new Date(value));
const dateRange = (event: EventRecord) => `${date(event.startUTC, event.timezone, { month: "short", year: undefined })} – ${date(event.endUTC, event.timezone, { month: "short" })}`;
const localTime = (value: string, timezone: string) => new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(value));
const badge = (event: EventRecord, now: number) => `<span class="status${watchStatus(event, now) === "Archive" ? " archive" : ""}">${watchStatus(event, now)}</span>`;

function image(event: EventRecord, featured = false): string {
  return `<img src="${heroPath(event)}" srcset="${heroPath(event, 768)} 768w, ${heroPath(event)} 1536w, ${heroPath(event, 2400)} 2400w" sizes="${featured ? "(max-width: 700px) calc(100vw - 40px), 700px" : "(max-width: 700px) calc(100vw - 40px), 580px"}" width="3840" height="2160" alt="${e(event.hero.alt)}" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function header(): string {
  return `<a class="skip" href="#content">Skip to content</a><header class="nav"><div class="wrap nav-inner"><a class="brand" href="/" aria-label="Live Orbit home"><img src="/assets/september/app-icon-96.png" width="34" height="34" alt=""><span>Live Orbit</span></a><nav aria-label="Primary navigation"><a href="/#discover">Discover</a><a href="/#gallery">A closer look</a><a href="/events/" aria-current="page">Events</a><a href="/support/">Support</a></nav><a class="button" href="${APP_STORE}" aria-label="Download Live Orbit on the App Store">Download</a></div></header>`;
}

function footer(now: number): string {
  const links = [["Features", "/features/"], ["Guides", "/guides/"], ["Events", "/events/"], ["Visibility lab", "/tools/satellite-visibility/"], ["Press kit", "/press/"], ["Support", "/support/"], ["Privacy", "/privacy/"], ["Data credits", "/credits/"], ["Terms", "/terms/"], ["RSS", "/events/feed.xml"]];
  return `<footer class="footer"><div class="wrap"><div class="footer-top"><a class="brand" href="/" aria-label="Live Orbit home"><img src="/assets/september/app-icon-96.png" width="36" height="36" alt=""><span>Live Orbit</span></a><p>A little curiosity goes a long way.</p></div><div class="footer-bottom"><p>© ${new Date(now).getUTCFullYear()} <a href="https://appsmadebetter.com/">Apps Made Better LLC</a></p><nav aria-label="Footer navigation">${links.map(([label, path]) => `<a href="${path}">${label}</a>`).join("")}</nav></div></div></footer>`;
}

function cta(): string {
  return `<section class="cta" aria-labelledby="download-title"><div class="wrap cta-inner"><div><h2 id="download-title">A little closer to space.</h2><p>Explore satellites and plan your next visible pass with Live Orbit.</p></div><div class="cta-actions"><a class="button" href="${APP_STORE}">Download on the App Store</a><small>For iPhone and iPad. Free with in-app purchases.</small></div></div></section>`;
}

function page(options: { title: string; description: string; path: string; body: string; now: number; image?: string; imageAlt?: string; schema?: object[]; article?: EventRecord; noindex?: boolean }): string {
  const { title, description, path, body, now, article } = options;
  const previewImage = `${SITE}${options.image || "/og-live-orbit-september.png"}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${SITE}${path}"><meta name="robots" content="${options.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}"><meta property="og:type" content="${article ? "article" : "website"}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${SITE}${path}"><meta property="og:site_name" content="Live Orbit"><meta property="og:locale" content="en_US"><meta property="og:image" content="${previewImage}"><meta property="og:image:width" content="${options.image ? 2400 : 1200}"><meta property="og:image:height" content="${options.image ? 1350 : 630}"><meta property="og:image:alt" content="${e(options.imageAlt || "Live Orbit for iPhone and iPad")}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${previewImage}"><meta name="twitter:image:alt" content="${e(options.imageAlt || "Live Orbit for iPhone and iPad")}">${article ? `<meta property="article:published_time" content="${publishedAt(article)}"><meta property="article:modified_time" content="${modifiedAt(article)}"><meta property="article:author" content="${SITE}/">` : ""}<link rel="icon" href="/assets/september/app-icon-48.png" type="image/png"><link rel="apple-touch-icon" href="/assets/september/app-icon-180.png"><link rel="alternate" type="application/rss+xml" title="Live Orbit Events" href="${SITE}/events/feed.xml"><link rel="preload" href="/events/assets/instrument-sans.woff2" as="font" type="font/woff2" crossorigin><style>${styles}</style>${options.schema ? `<script type="application/ld+json">${jsonLd({ "@context": "https://schema.org", "@graph": options.schema })}</script>` : ""}</head><body>${header()}<main id="content">${body}</main>${footer(now)}</body></html>`;
}

function storyCard(event: EventRecord, now: number): string {
  return `<article class="story"><a class="image-link" href="${eventPath(event)}" aria-label="${e(event.title)}"><figure>${image(event)}</figure></a><div class="story-meta">${badge(event, now)}<span class="date-range">${e(dateRange(event))}</span></div><h3><a href="${eventPath(event)}">${e(event.title)}</a></h3><p>${e(event.description)}</p><a class="text-link" href="${eventPath(event)}" aria-label="Read ${e(event.title)}">Read the story <span aria-hidden="true">↗</span></a></article>`;
}

export function renderIndex(events: EventRecord[], now: number): string {
  const visible = publishedEvents(events, now);
  const active = visible.filter(event => now < Date.parse(event.endUTC));
  const archived = visible.filter(event => now >= Date.parse(event.endUTC));
  const featured = active.find(event => event.category === "Anniversary") || active[0];
  const others = active.filter(event => event !== featured);
  const body = `<section class="wrap intro"><p class="eyebrow"><span class="dot"></span>Live Orbit Events</p><div class="intro-line"><h1>Space has<br><span>a story to tell.</span></h1><p>Milestones worth marking. Missions worth following. A reason to look a little closer.</p></div></section>
  ${featured ? `<section class="wrap" aria-label="Featured event"><article class="featured"><a class="image-link" href="${eventPath(featured)}" aria-label="${e(featured.title)}">${image(featured, true)}</a><div class="featured-copy">${badge(featured, now)}<div class="date-range">${e(dateRange(featured))}</div><h2><a href="${eventPath(featured)}">${e(featured.title)}</a></h2><p>${e(featured.description)}</p><a class="text-link" href="${eventPath(featured)}" aria-label="Read ${e(featured.title)}">Explore the story <span aria-hidden="true">↗</span></a></div></article></section>` : `<div class="wrap empty"><p>There are no current watches. Explore the archive and our satellite guides while the next story takes shape.</p></div>`}
  ${others.length ? `<section class="wrap section" aria-labelledby="watch-title"><div class="section-header"><h2 id="watch-title">Worth a closer look.</h2><p>Current stories &amp; watches</p></div><div class="stories">${others.map(event => storyCard(event, now)).join("")}</div></section>` : ""}
  ${archived.length ? `<section class="archive-section section" aria-labelledby="archive-title"><div class="wrap"><div class="section-header"><h2 id="archive-title">From the archive.</h2><p>Past events, still worth exploring</p></div><div class="stories">${archived.map(event => storyCard(event, now)).join("")}</div></div></section>` : ""}
  <div class="wrap notes"><p class="index-note">These are Live Orbit editorial events and watch periods, with dates shown in New York time. Mission dates can change; a watch is an invitation to follow the story, not a confirmed launch or a visibility forecast. Artwork is editorial illustration. For help looking up, start with our <a href="/guides/">satellite tracking guides</a>.</p></div>${cta()}`;
  return page({ title: "Space Events & Mission Stories | Live Orbit", description: "Explore space milestones, mission watches, and satellite observing stories from Live Orbit, with clear dates, useful context, and links to primary sources.", path: "/events/", body, now, image: featured ? heroPath(featured, 2400) : undefined, imageAlt: featured?.hero.alt, schema: [organization, { "@type": "CollectionPage", "@id": `${SITE}/events/#collection`, name: "Live Orbit Events", url: `${SITE}/events/`, publisher: organization, mainEntity: { "@type": "ItemList", itemListElement: visible.map((event, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${eventPath(event)}`, name: event.title })) } }] });
}

export function articleSchema(event: EventRecord): object[] {
  const url = `${SITE}${eventPath(event)}`;
  const image = { "@type": "ImageObject", "@id": `${url}#image`, contentUrl: `${SITE}${heroPath(event, 2400)}`, url: `${SITE}${heroPath(event, 2400)}`, width: 2400, height: 1350, caption: event.hero.caption, description: event.hero.alt, creditText: "Live Orbit editorial illustration", creator: author };
  return [organization, image, { "@type": "BlogPosting", "@id": `${url}#article`, mainEntityOfPage: url, url, headline: event.title, description: event.description, image: { "@id": `${url}#image` }, datePublished: publishedAt(event), dateModified: modifiedAt(event), author, publisher: organization, inLanguage: "en-US", articleSection: event.category, citation: event.sources.map(source => source.url) }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Live Orbit", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Events", item: `${SITE}/events/` }, { "@type": "ListItem", position: 3, name: event.title, item: url }] }];
}

export function renderArticle(event: EventRecord, events: EventRecord[], now: number): string {
  const relatedEvents = publishedEvents(events, now).filter(other => event.relatedEventKeys.includes(other.event_key));
  const related = [...relatedEvents.map(other => ({ title: other.title, path: eventPath(other), label: "Event story" })), ...event.relatedGuides.map(guide => ({ ...guide, label: "Viewing guide" }))].slice(0, 3);
  const body = `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Live Orbit</a><span aria-hidden="true">/</span><a href="/events/">Events</a><span aria-hidden="true">/</span><span aria-current="page">${e(event.title)}</span></nav><article><header class="article-header"><p class="eyebrow">${e(event.category)} <span aria-hidden="true">·</span> ${watchStatus(event, now)}</p><h1>${e(event.title)}</h1><p class="dek">${e(event.description)}</p><div class="byline"><span>By <a href="/">Live Orbit</a> · Apps Made Better LLC</span><span>Published <time datetime="${publishedAt(event)}">${date(publishedAt(event))}</time></span>${modifiedAt(event) !== publishedAt(event) ? `<span>Updated <time datetime="${modifiedAt(event)}">${date(modifiedAt(event))}</time></span>` : ""}</div></header><figure class="hero-figure">${image(event, true)}<figcaption>${e(event.hero.caption)}</figcaption></figure><div class="article-layout"><div class="prose"><p class="lead">${e(event.intro)}</p>${event.sections.map(section => `<section><h2>${e(section.heading)}</h2>${section.paragraphs.map(p => `<p>${e(p)}</p>`).join("")}</section>`).join("")}${event.corrections.length ? `<section class="correction"><h2>Updates &amp; corrections</h2>${event.corrections.map(correction => `<p><time datetime="${correction.atUTC}">${date(correction.atUTC)}</time>: ${e(correction.note)} <a href="${e(correction.sourceUrl)}">Source</a></p>`).join("")}</section>` : ""}<section class="sources" aria-labelledby="sources-title"><h2 id="sources-title">Sources &amp; further reading</h2><ol>${event.sources.map(source => `<li><a href="${e(source.url)}" rel="noopener">${e(source.title)}</a>${source.date ? ` <span>(${e(source.date)})</span>` : ""}</li>`).join("")}</ol><p class="checked">Primary sources checked ${date(event.sourceCheckedAtUTC)}. Mission information reflects those sources as checked; follow the operator for later changes.</p></section></div><aside class="watch-panel" aria-labelledby="watch-panel-title"><h2 id="watch-panel-title">${event.category === "Anniversary" ? "Mark the moment" : "About this watch"}</h2>${badge(event, now)}<dl><div><dt>Starts</dt><dd><time datetime="${event.startUTC}">${date(event.startUTC, event.timezone)}<br>${localTime(event.startUTC, event.timezone)}</time></dd></div><div><dt>Ends</dt><dd><time datetime="${event.endUTC}">${date(event.endUTC, event.timezone)}<br>${localTime(event.endUTC, event.timezone)}</time></dd></div><div><dt>Timezone</dt><dd>${e(event.timezone.split("/").at(-1)!.replaceAll("_", " "))}</dd></div><div><dt>Event</dt><dd>${e(event.category === "Mission watch" ? "Editorial mission watch" : "Live Orbit editorial event")}</dd></div></dl><p class="basis">${e(event.scheduleBasis)}</p><a class="text-link" href="/events/">All event stories <span aria-hidden="true">↗</span></a></aside></div></article></div>${related.length ? `<section class="related" aria-labelledby="related-title"><div class="wrap"><div class="section-header"><h2 id="related-title">Keep exploring.</h2></div><div class="related-grid">${related.map(link => `<a class="related-link" href="${e(link.path)}"><span>${link.label}</span>${e(link.title)} <span aria-hidden="true">↗</span></a>`).join("")}</div></div></section>` : ""}${cta()}`;
  return page({ title: `${event.title} | Live Orbit`, description: event.description, path: eventPath(event), image: heroPath(event, 2400), imageAlt: event.hero.alt, article: event, now, body, schema: articleSchema(event) });
}

export function renderNotFound(now: number): string {
  return page({ title: "Page not found | Live Orbit", description: "Explore current event stories and satellite tracking guides from Live Orbit.", path: "/events/", now, noindex: true, body: `<section class="wrap error-page"><p class="eyebrow">Live Orbit</p><h1>That story isn’t here.</h1><p>Explore the current event stories or find a guide for your next look at the sky.</p><a class="text-link" href="/events/">Explore Events <span aria-hidden="true">↗</span></a></section>` });
}

export function sitemapEntries(events: EventRecord[], now: number): string {
  const visible = publishedEvents(events, now);
  const lastmod = visible.map(modifiedAt).sort().at(-1);
  return `<url><loc>${SITE}/events/</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>${visible.map(event => `<url><loc>${SITE}${eventPath(event)}</loc><lastmod>${modifiedAt(event)}</lastmod><image:image><image:loc>${SITE}${heroPath(event, 2400)}</image:loc></image:image></url>`).join("")}`;
}

export function renderSitemap(events: EventRecord[], now: number): string {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${sitemapEntries(events, now)}</urlset>`;
}

export function extendSitemap(xml: string, events: EventRecord[], now: number): string {
  if (!xml.includes("</urlset>")) throw new Error("Expected an upstream urlset sitemap");
  const withImages = xml.includes("xmlns:image=") ? xml : xml.replace("<urlset ", '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ');
  return withImages.replace("</urlset>", sitemapEntries(events, now) + "</urlset>");
}

export function renderRSS(events: EventRecord[], now: number): string {
  const visible = publishedEvents(events, now);
  const lastmod = visible.map(modifiedAt).sort().at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Live Orbit Events</title><link>${SITE}/events/</link><description>Space milestones, mission watches, and satellite observing stories from Live Orbit.</description><language>en-us</language><atom:link href="${SITE}/events/feed.xml" rel="self" type="application/rss+xml"/>${lastmod ? `<lastBuildDate>${new Date(lastmod).toUTCString()}</lastBuildDate>` : ""}${visible.map(event => `<item><title>${e(event.title)}</title><link>${SITE}${eventPath(event)}</link><guid isPermaLink="true">${SITE}${eventPath(event)}</guid><pubDate>${new Date(publishedAt(event)).toUTCString()}</pubDate><description>${e(event.description)}</description></item>`).join("")}</channel></rss>`;
}
