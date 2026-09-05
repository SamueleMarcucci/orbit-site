import type { MetadataRoute } from "next";
import { guides, guideDate } from "@/lib/guides";
import { canonical } from "@/lib/seo";
import { site, socialPreviewImage } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const artwork = ["sky", "sky-detail", "passes", "alerts", "radio", "search", "news", "languages"];
  return [
    { url: canonical(), lastModified: guideDate, images: [`${site.url}/assets/september/hand-earth-updated-1400.webp`, ...artwork.map(name=>`${site.url}/assets/september/${name}-1242.webp`)] },
    ...["/support/", "/privacy/", "/terms/"].map(path=>({url:canonical(path)})),
    { url: canonical("/guides/"), lastModified: guideDate },
    ...guides.map(guide=>({url:canonical(`/guides/${guide.slug}/`),lastModified:guideDate,images:[`${site.url}${socialPreviewImage}`]})),
  ];
}
