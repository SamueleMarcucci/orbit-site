import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono, Roboto_Condensed } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { assetPath, basePath, site } from "@/lib/site";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600", "700"]
});

const body = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(basePath ? "https://samuelemarcucci.github.io" : site.url),
  title: {
    default: "Live Orbit | Satellite tracking for iPhone",
    template: "%s | Live Orbit"
  },
  description: "Live Orbit is a prelaunch iPhone app for satellite tracking, pass predictions, Sky Mode, insights, news, and trusted orbital data.",
  openGraph: {
    title: "Live Orbit",
    description: "Prelaunch iPhone satellite tracking built around public orbital data and honest sky estimates.",
    url: site.url,
    siteName: "Live Orbit",
    images: [{ url: assetPath("/og-image.svg"), width: 1200, height: 630, alt: "Live Orbit tactical launch plate" }],
    type: "website"
  },
  icons: {
    icon: assetPath("/assets/live-orbit-icon.png"),
    apple: assetPath("/assets/live-orbit-icon.png")
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
