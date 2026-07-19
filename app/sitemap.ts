import type { MetadataRoute } from "next";
import { places } from "@/content/places";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewedAt = new Date("2026-07-19T00:00:00+08:00");
  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: reviewedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/explore", siteUrl).toString(),
      lastModified: reviewedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...places.map((place) => ({
      url: new URL(`/places/${place.slug}`, siteUrl).toString(),
      lastModified: new Date(`${place.verification.reviewedAt}T00:00:00+08:00`),
      changeFrequency: "monthly" as const,
      priority: place.featured ? 0.8 : 0.6,
    })),
  ];
}
