import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="orbit-footer">
      <div className="wrap">
        <div className="footer-top"><Link className="brand" href="/" aria-label="Live Orbit home"><Image src={assetPath("/assets/september/app-icon-96.png")} alt="" width={36} height={36} /><span>Live Orbit</span></Link><p>A little curiosity goes a long way.</p></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} <a href="https://appsmadebetter.com/">Apps Made Better LLC</a></p><nav aria-label="Footer navigation"><Link href="/guides/">Guides</Link><Link href="/support/">Support</Link><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link></nav><a className="company-credit" href="https://appsmadebetter.com/">Made with care <span aria-hidden="true">↗</span></a></div>
      </div>
    </footer>
  );
}
