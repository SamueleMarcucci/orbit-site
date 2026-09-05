import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnalyticsEvents } from "@/components/analytics-events";
import { assetPath, basePath, site, socialPreviewImage } from "@/lib/site";
import { DEFAULT_DESCRIPTION, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const body = localFont({ src: "./fonts/instrument-sans.woff2", variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(basePath ? "https://samuelemarcucci.github.io" : site.url),
  title: {
    default: "Live Orbit | Native Satellite Tracker for iPhone",
    template: "%s | Live Orbit"
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: "Live Orbit | Native Satellite Tracker for iPhone",
    description: "Track satellites live from your iPhone with visible passes, Sky Mode, launches, news, and source-backed orbital context.",
    url: site.url,
    siteName: "Live Orbit",
    images: [{ url: assetPath(socialPreviewImage), width: 1200, height: 630, alt: "Live Orbit: Look up. There’s more. Satellite tracking for iPhone." }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Orbit | Native Satellite Tracker for iPhone",
    description: "Track satellites live from your iPhone with visible passes, Sky Mode, launches, news, and source-backed orbital context.",
    images: [assetPath(socialPreviewImage)]
  },
  alternates: {
    canonical: site.url
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  },
  icons: {
    icon: [
      { url: assetPath("/assets/september/app-icon-48.png"), type: "image/png", sizes: "48x48" },
      { url: assetPath("/assets/september/app-icon-192.png"), type: "image/png", sizes: "192x192" }
    ],
    apple: assetPath("/assets/september/app-icon-180.png")
  },
  manifest: assetPath("/manifest.webmanifest")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={body.variable}>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {gtmId ? (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        ) : null}
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <AnalyticsEvents />
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
