import type { Metadata } from "next";
import { assetPath, site, socialPreviewImage } from "@/lib/site";

export const DEFAULT_DESCRIPTION =
  "Track satellites on iPhone with Live Orbit. Explore Earth in 3D, plan visible passes, and find satellites with Sky Mode. Free with in-app purchases.";

const SOFTWARE_FEATURES = [
  "Satellite tracking around Earth",
  "Visible satellite pass planning",
  "Sky Mode and AR guidance",
  "Satellite details and search",
  "Radio observation recordings",
  "Space news",
];

export const SOFTWARE_SCREENSHOTS = [
  "/assets/september/earth-1440.webp",
  "/assets/september/passes-880.webp",
  "/assets/september/sky-880.webp",
  "/assets/september/radio-880.webp",
  "/assets/september/news-880.webp",
];

export type JsonLdData = Record<string, unknown>;

export function canonical(path = "/") {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/|\/$/g, "")}/`;
  return `${site.url}${normalized}`;
}

function absoluteAsset(path: string) {
  return `${site.url}${assetPath(path)}`;
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
    title: title || { absolute: "Live Orbit | Native Satellite Tracker for iPhone" },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      title: title ? `${title} | ${site.name}` : "Live Orbit | Native Satellite Tracker for iPhone",
      description,
      url,
      siteName: site.name,
      images: [{ url: assetPath(socialPreviewImage), width: 1200, height: 630, alt: "Live Orbit: Look up. There’s more. Satellite tracking for iPhone." }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${site.name}` : "Live Orbit | Native Satellite Tracker for iPhone",
      description,
      images: [assetPath(socialPreviewImage)],
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
    logo: "https://appsmadebetter.com/assets/apps-made-better-avatar-512.png",
    founder: { "@type": "Person", "@id": "https://appsmadebetter.com/about/#founder", name: "Samuele Marcucci", url: "https://appsmadebetter.com/about/" },
    address: { "@type": "PostalAddress", addressRegion: "TX", addressCountry: "US" },
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
    applicationCategory: "ReferenceApplication",
    operatingSystem: "iOS",
    description: DEFAULT_DESCRIPTION,
    image: absoluteAsset("/assets/september/app-icon-512.png"),
    screenshot: SOFTWARE_SCREENSHOTS.map(absoluteAsset),
    featureList: SOFTWARE_FEATURES,
    inLanguage: "en",
    installUrl: site.appStoreUrl,
    sameAs: [site.appStoreUrl],
    publisher: { "@id": "https://appsmadebetter.com/#organization" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to download with in-app purchases.",
      availability: "https://schema.org/InStock",
      url: site.appStoreUrl,
      seller: { "@id": "https://appsmadebetter.com/#organization" },
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
