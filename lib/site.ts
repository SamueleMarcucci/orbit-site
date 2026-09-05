export const site = {
  name: "Live Orbit",
  domain: "liveorbitapp.com",
  url: "https://www.liveorbitapp.com",
  appStoreUrl: "https://apps.apple.com/us/app/live-orbit/id6794325315",
  companyEmail: "founder@appsmadebetter.com",
  supportEmail: "support@liveorbitapp.com"
};

export const launchHref = site.appStoreUrl;

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(path: string) {
  return `${basePath}${path}`;
}

export const socialPreviewImage = "/og-live-orbit-september.png";

export const navItems = [
  { href: "/support/", label: "Support" },
  { href: "/privacy/", label: "Privacy" },
];
