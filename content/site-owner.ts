import type { SiteOwnerProfile, SupportProfile } from "@/types/site-owner";

export const siteOwner: SiteOwnerProfile = {
  displayName: "Dohn Michael Varquez",
  role: "Developer of Hello Tagbilaran",
  education: "Fourth-year Computer Science student at Visayas State University",
  biography:
    "Dohn Michael Varquez is the student developer behind Hello Tagbilaran, working across research, interface design, and front-end development.",
  motivation:
    "He created the archive to present Tagbilaran through its own history, barangays, public places, and everyday city life.",
  contributions: [
    "Research and editorial direction",
    "Interface design",
    "Development",
  ],
  portrait: {
    src: "/images/about/dohn-michael-varquez.webp",
    alt: "Portrait of Dohn Michael Varquez, developer of Hello Tagbilaran",
    width: 1600,
    height: 1600,
  },
  links: [
    {
      label: "GitHub",
      href: "https://github.com/Kikypochiki",
    },
  ],
  placeholder: false,
};

export const supportProfile: SupportProfile = {
  provider: "GCash",
  recipient: "Dohn Michael Varquez",
  qr: {
    src: "/images/support/gcash-dohn-michael-varquez-qr.png",
    alt: "GCash payment QR code for Dohn Michael Varquez",
    width: 296,
    height: 296,
  },
  placeholder: false,
};
