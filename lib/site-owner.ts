import type { SiteOwnerProfile, SupportProfile } from "@/types/site-owner";

export function validateSiteOwner(owner: SiteOwnerProfile, support: SupportProfile) {
  const errors: string[] = [];
  if (!owner.displayName.trim() || owner.placeholder) errors.push("Developer profile is still a placeholder.");
  if (!owner.biography.trim()) errors.push("Developer biography is required.");
  if (!owner.portrait.src.startsWith("/")) errors.push("Developer portrait must be a local reviewed asset.");
  if (support.placeholder) errors.push("Support destination is still a placeholder.");
  if (!support.donationUrl?.startsWith("https://")) errors.push("Support destination must use HTTPS.");
  if (!support.provider.trim() || !support.recipient.trim()) errors.push("Support provider and recipient are required.");
  return errors;
}
