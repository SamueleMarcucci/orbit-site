"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { assetPath, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const home = pathname === "/";
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      header.current?.style.setProperty("--nav-progress", String(Math.min(1, Math.max(0, window.scrollY / 180))));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, [pathname]);
  return (
    <header ref={header} className={`orbit-nav${home ? " orbit-nav--home" : ""}`}>
      <div className="wrap orbit-nav-inner">
        <Link className="brand" href="/" aria-label="Live Orbit home">
          <Image src={assetPath("/assets/september/app-icon-96.png")} alt="" width={34} height={34} priority />
          <span>Live Orbit</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#discover">Discover</Link>
          <Link href="/#gallery">A closer look</Link>
          <Link href="/support/">Support</Link>
        </nav>
        <a className="download-button nav-download" href={site.appStoreUrl} aria-label="Download Live Orbit on the App Store" data-analytics-event="app_store_cta_click" data-analytics-label="Navigation download">Download</a>
      </div>
    </header>
  );
}
