import type { SiteOwnerProfile, SupportProfile } from "@/types/site-owner";

export function validateSiteOwner(owner: SiteOwnerProfile, support: SupportProfile) {
  const errors: string[] = [];
  if (!owner.displayName.trim() || owner.placeholder) errors.push("Developer profile is still a placeholder.");
  if (!owner.biography.trim()) errors.push("Developer biography is required.");
  if (!owner.portrait.src.startsWith("/")) errors.push("Developer portrait must be a local reviewed asset.");
  if (owner.links.some((link) => !link.href.startsWith("https://"))) {
    errors.push("Developer links must use HTTPS.");
  }
  if (support.placeholder) errors.push("Support destination is still a placeholder.");
  if (support.donationUrl && !support.donationUrl.startsWith("https://")) {
    errors.push("Support destination must use HTTPS.");
  }
  if (!support.donationUrl && !support.qr.src.startsWith("/")) {
    errors.push("Support requires an HTTPS destination or a local reviewed QR asset.");
  }
  if (!support.provider.trim() || !support.recipient.trim()) errors.push("Support provider and recipient are required.");
  return errors;
}
