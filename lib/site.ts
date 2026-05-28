export const site = {
  name: "Live Orbit",
  domain: "liveorbitapp.com",
  url: "https://liveorbitapp.com",
  supportEmail: "support@liveorbitapp.com",
  launchSubject: "Live Orbit launch list"
};

export const launchHref = `mailto:${site.supportEmail}?subject=${encodeURIComponent(site.launchSubject)}`;

export const navItems = [
  { href: "/features/", label: "Features" },
  { href: "/data-sources/", label: "Sources" },
  { href: "/support/", label: "Support" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/about/", label: "About" }
];
