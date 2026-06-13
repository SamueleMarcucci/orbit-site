export const site = {
  name: "Live Orbit",
  domain: "liveorbitapp.com",
  url: "https://liveorbitapp.com",
  companyEmail: "founder@appsmadebetter.com",
  supportEmail: "support@liveorbitapp.com",
  launchSubject: "Live Orbit launch list"
};

export const launchHref = `mailto:${site.supportEmail}?subject=${encodeURIComponent(site.launchSubject)}`;

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(path: string) {
  return `${basePath}${path}`;
}

export const navItems = [
  { href: "/features/", label: "Features" },
  { href: "/data-sources/", label: "Sources" },
  { href: "/support/", label: "Support" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/about/", label: "About" }
];
