import type { Metadata } from "next";
import Script from "next/script";
import { Archivo_Black, Geist, Geist_Mono } from "next/font/google";
import { AnalyticsEvents } from "@/components/analytics-events";
import { assetPath, basePath, site } from "@/lib/site";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400"
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(basePath ? "https://samuelemarcucci.github.io" : site.url),
  title: {
    default: "Live Orbit | Satellite Tracking, Built for iPhone",
    template: "%s | Live Orbit"
  },
  description: "A native iPhone app for live satellites, visible passes, Sky Mode, launches, space news, and trusted orbital context.",
  openGraph: {
    title: "Live Orbit",
    description: "Satellite tracking built for iPhone with visible passes, Sky Mode, launches, news, and trusted orbital context.",
    url: site.url,
    siteName: "Live Orbit",
    images: [{ url: assetPath("/og-image.svg"), width: 1200, height: 630, alt: "Live Orbit wordmark with a luminous orbital arc" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Orbit",
    description: "Satellite tracking built for iPhone with visible passes, Sky Mode, launches, news, and trusted orbital context.",
    images: [assetPath("/og-image.svg")]
  },
  alternates: {
    canonical: site.url
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: assetPath("/assets/live-orbit-google-icon-48.png"), type: "image/png", sizes: "48x48" },
      { url: assetPath("/assets/live-orbit-google-icon-96.png"), type: "image/png", sizes: "96x96" },
      { url: assetPath("/assets/live-orbit-google-icon-192.png"), type: "image/png", sizes: "192x192" },
      { url: assetPath("/assets/live-orbit-google-icon-512.png"), type: "image/png", sizes: "512x512" },
      { url: assetPath("/favicon.ico"), type: "image/x-icon", sizes: "any" },
      { url: assetPath("/assets/live-orbit-search-icon.png"), type: "image/png", sizes: "1024x1024" },
      { url: assetPath("/assets/live-orbit-google-icon.png"), type: "image/png", sizes: "1024x1024" }
    ],
    shortcut: assetPath("/favicon.ico"),
    apple: assetPath("/assets/live-orbit-search-icon.png")
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
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
        {gaId && !gtmId ? (
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
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
