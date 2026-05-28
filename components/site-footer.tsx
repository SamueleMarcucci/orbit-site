import Image from "next/image";
import Link from "next/link";
import { assetPath, launchHref, navItems, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark">
        <Image src={assetPath("/assets/live-orbit-icon.png")} alt="" width={42} height={42} />
        <span>Live Orbit</span>
      </div>
      <div className="footer-command">
        <p>Prelaunch satellite tracking for iPhone. No App Store claim until launch is real.</p>
        <a href={launchHref}>Join the launch list</a>
      </div>
      <nav aria-label="Footer navigation" className="footer-links">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/terms/">Terms</Link>
      </nav>
      <div className="footer-meta">
        <span>{site.supportEmail}</span>
        <span>Positions and passes are estimates.</span>
      </div>
    </footer>
  );
}
