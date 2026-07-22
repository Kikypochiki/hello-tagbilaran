import type { SiteOwnerProfile, SupportProfile } from "@/types/site-owner";

export const siteOwner: SiteOwnerProfile = {
  displayName: "Developer profile pending",
  role: "Designer and developer of Hello Tagbilaran",
  biography: "This development placeholder will be replaced with the creator's approved short biography before publication.",
  motivation: "Hello Tagbilaran is an independent effort to present the city as a destination with its own history, neighborhoods, and everyday life.",
  portrait: {
    src: "/images/developer-placeholder.svg",
    alt: "Development placeholder for the creator portrait",
    width: 720,
    height: 900,
  },
  links: [],
  placeholder: true,
};

export const supportProfile: SupportProfile = {
  provider: "Donation provider pending",
  recipient: "Recipient pending",
  qr: {
    src: "/images/support-qr-placeholder.svg",
    alt: "Development placeholder; this is not a scannable payment QR code",
    width: 720,
    height: 720,
  },
  placeholder: true,
};
