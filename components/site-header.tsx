import Image from "next/image";
import Link from "next/link";
import { assetPath, launchHref, navItems } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header" data-unit="NAV/PRIMARY">
      <Link className="brand-lockup" href="/" aria-label="Live Orbit home">
        <Image src={assetPath("/assets/live-orbit-icon.png")} alt="" width={34} height={34} priority />
        <span>Live Orbit</span>
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="nav-action" href={launchHref}>
        Join
      </a>
    </header>
  );
}
