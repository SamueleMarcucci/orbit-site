import type { MetadataRoute } from "next";
import { guides, contentUpdatedAt } from "@/lib/guides";
import { canonical } from "@/lib/seo";
import { site, socialPreviewImage } from "@/lib/site";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const artwork = ["sky", "sky-detail", "passes", "alerts", "radio", "search", "news", "languages"];
  return [
    { url: canonical(), lastModified: contentUpdatedAt, images: [`${site.url}/assets/september/hand-earth-updated-1400.webp`, ...artwork.map(name => `${site.url}/assets/september/${name}-1242.webp`)] },
    ...["/support/", "/privacy/", "/credits/", "/terms/"].map(path => ({ url: canonical(path) })),
    { url: canonical("/features/"), lastModified: contentUpdatedAt },
    { url: canonical("/guides/"), lastModified: contentUpdatedAt },
    ...guides.map(guide => ({ url: canonical(`/guides/${guide.slug}/`), lastModified: guide.modifiedAt, images: [`${site.url}${guide.image?.path || socialPreviewImage}`] })),
  ];
}
