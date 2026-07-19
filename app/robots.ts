import type { MetadataRoute } from "next";
import { hasProductionSiteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: hasProductionSiteUrl
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
