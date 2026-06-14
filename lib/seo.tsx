import type { Metadata } from "next";
import { assetPath, site } from "@/lib/site";

const DEFAULT_DESCRIPTION =
  "Track satellites live, plan visible passes, use Sky Mode, follow launches and space news, and get AI Orbit Intelligence on iPhone.";

export type JsonLdData = Record<string, unknown>;

export function canonical(path = "/") {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/|\/$/g, "")}/`;
  return `${site.url}${normalized}`;
}

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noindex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = canonical(path);
  return {
    title: title || { absolute: "Live Orbit | AI-Powered Satellite Tracker for iPhone" },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      url,
      siteName: site.name,
      images: [{ url: assetPath("/og-image.svg"), width: 1200, height: 630, alt: "Live Orbit wordmark with a luminous orbital arc" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      images: [assetPath("/og-image.svg")],
    },
  };
}

export function organizationJsonLd(): JsonLdData {
  return {
    "@type": "Organization",
    "@id": "https://appsmadebetter.com/#organization",
    name: "Apps Made Better LLC",
    legalName: "Apps Made Better LLC",
    url: "https://appsmadebetter.com/",
    email: site.companyEmail,
  };
}

export function websiteJsonLd(): JsonLdData {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { "@id": "https://appsmadebetter.com/#organization" },
  };
}

export function softwareJsonLd(): JsonLdData {
  return {
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: site.name,
    url: `${site.url}/`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": "https://appsmadebetter.com/#organization" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      url: canonical("/testing"),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdData {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>): JsonLdData {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const graph = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
