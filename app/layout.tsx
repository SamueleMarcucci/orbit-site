import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Live Orbit | Satellite tracking for iPhone",
    template: "%s | Live Orbit"
  },
  description: site.description,
  applicationName: "Live Orbit",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/assets/live-orbit-icon.png",
    apple: "/assets/live-orbit-icon.png"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Live Orbit",
    description: site.description,
    url: site.url,
    siteName: "Live Orbit",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Live Orbit Earth globe"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Orbit",
    description: site.description,
    images: ["/og-image.svg"]
  }
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-[var(--font-geist)]">
        <SiteHeader />
        <main className="min-h-screen overflow-x-clip">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
