import Image from "next/image";
import Link from "next/link";
import { LaunchButton } from "@/components/launch-button";
import { navItems, site } from "@/lib/site";

const legalLinks = [
  { label: "Terms", href: "/terms/" },
  { label: "Data sources", href: "/data-sources/" }
];

export function SiteFooter() {
  return (
    <footer className="page-shell pb-10 pt-24">
      <div className="surface-shell">
        <div className="surface-core overflow-hidden p-6 md:p-9">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/assets/live-orbit-icon.png" alt="" width={42} height={42} className="rounded-xl" />
                <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--text)]">{site.name}</span>
              </div>
              <h2 className="mt-8 max-w-2xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--text)] md:text-6xl">
                Watch the sky with context before the app launches.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 tracking-[-0.01em] text-[var(--muted)]">
                Live Orbit is in prelaunch. Join the launch list for release notes, TestFlight news, and early product updates.
              </p>
              <div className="mt-7">
                <LaunchButton />
              </div>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:justify-self-end">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">Site</p>
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <Link key={item.href} className="text-sm text-[var(--muted)] hover:text-[var(--text)]" href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">Launch</p>
                <div className="grid gap-2">
                  <a className="text-sm text-[var(--muted)] hover:text-[var(--text)]" href={`mailto:${site.supportEmail}`}>
                    {site.supportEmail}
                  </a>
                  {legalLinks.map((item) => (
                    <Link key={item.href} className="text-sm text-[var(--muted)] hover:text-[var(--text)]" href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-5 text-xs text-[var(--faint)]">
            <p>Designed and developed by Samuele Marcucci.</p>
            <p>Satellite positions and passes are estimates.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
