export interface SiteOwnerProfile {
  displayName: string;
  role: string;
  education: string;
  biography: string;
  motivation: string;
  contributions: string[];
  portrait: { src: string; alt: string; width: number; height: number };
  links: { label: string; href: string }[];
  placeholder: boolean;
}

export interface SupportProfile {
  provider: string;
  recipient: string;
  donationUrl?: string;
  qr: { src: string; alt: string; width: number; height: number };
  placeholder: boolean;
}
