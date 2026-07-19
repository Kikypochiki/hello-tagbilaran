const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const hasProductionSiteUrl = Boolean(configuredSiteUrl);
export const siteUrl = new URL(configuredSiteUrl || "http://localhost:3000");
