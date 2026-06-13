import type { Metadata } from "next";
import { Archivo_Black, Geist, Geist_Mono } from "next/font/google";
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
    default: "Live Orbit | Prelaunch satellite tracking for iPhone",
    template: "%s | Live Orbit"
  },
  description: "Live Orbit is a prelaunch iPhone app for satellite tracking, pass predictions, Sky Mode, insights, news, and trusted orbital data.",
  openGraph: {
    title: "Live Orbit",
    description: "Prelaunch iPhone satellite tracking built around public orbital data and honest sky estimates.",
    url: site.url,
    siteName: "Live Orbit",
    images: [{ url: assetPath("/og-image.svg"), width: 1200, height: 630, alt: "Live Orbit wordmark with a luminous orbital arc" }],
    type: "website"
  },
  icons: {
    icon: [
      { url: assetPath("/favicon.ico") },
      { url: assetPath("/assets/live-orbit-google-icon.png"), type: "image/png", sizes: "1024x1024" }
    ],
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
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
