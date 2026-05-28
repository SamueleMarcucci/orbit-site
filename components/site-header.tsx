"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { LaunchButton } from "@/components/launch-button";
import { navItems, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-[oklch(0.1_0.018_248_/_0.76)] px-3 py-2 shadow-[0_18px_60px_oklch(0_0_0_/_0.34)] backdrop-blur-2xl">
        <Link className="focus-ring flex items-center gap-3 rounded-full pr-2" href="/" aria-label="Live Orbit home">
          <Image
            src="/assets/live-orbit-icon.png"
            alt=""
            width={36}
            height={36}
            className="rounded-[0.7rem] bg-white/10 ring-1 ring-white/10"
            priority
          />
          <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--text)]">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-full px-3.5 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ease-[var(--ease-out)] ${
                  active ? "bg-white/10 text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LaunchButton variant="secondary" />
          </div>
          <button
            className="focus-ring grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-[var(--text)] md:hidden"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={19} weight="bold" /> : <List size={19} weight="bold" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`mx-auto mt-3 w-[min(100%,28rem)] origin-top rounded-[1.6rem] border border-white/10 bg-[oklch(0.1_0.018_248_/_0.94)] p-2 shadow-[0_20px_70px_oklch(0_0_0_/_0.42)] backdrop-blur-2xl transition-[opacity,transform] duration-300 ease-[var(--ease-drawer)] md:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="grid gap-1" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-full px-4 py-3 text-sm font-semibold tracking-[-0.01em] text-[var(--muted)] hover:bg-white/[0.055] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="px-2 py-2 sm:hidden">
            <LaunchButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
