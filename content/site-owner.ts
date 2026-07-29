import type { SiteOwnerProfile, SupportProfile } from "@/types/site-owner";

export const siteOwner: SiteOwnerProfile = {
  displayName: "Dohn Michael Varquez",
  role: "Developer of Hello Tagbilaran",
  education: "Fourth-year Computer Science student at Visayas State University",
  biography:
    "Dohn Michael Varquez is the student developer behind Hello Tagbilaran. He brings together research, interface design, and front-end development to shape the archive into a clear, useful way to encounter the city.",
  motivation:
    "He created the project to give Tagbilaran room to be understood on its own terms—through its history, barangays, public places, and everyday city life, rather than only as a point of arrival for the rest of Bohol.",
  contributions: [
    "Project direction and research",
    "Interface and interaction design",
    "Front-end development",
    "Content and map experience",
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
