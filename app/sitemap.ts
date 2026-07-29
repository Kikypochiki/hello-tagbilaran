import type { MetadataRoute } from "next";
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
    {
      url: new URL("/about", siteUrl).toString(),
      lastModified: reviewedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: new URL("/hazard-assessment", siteUrl).toString(),
      lastModified: reviewedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
