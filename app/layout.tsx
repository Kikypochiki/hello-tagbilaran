import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlobalMotion } from "@/components/global-motion";
import { StaleServiceWorkerCleanup } from "@/components/stale-service-worker-cleanup";
import { hasProductionSiteUrl, siteUrl } from "@/lib/site";
import "./globals.css";
import "./immersive-experience.css";
import "./motion-structure.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const serif = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Hello Tagbilaran",
    template: "%s | Hello Tagbilaran",
  },
  description:
    "An editorial tourism and local-discovery field journal for Tagbilaran City, Bohol.",
  applicationName: "Hello Tagbilaran",
  keywords: ["Tagbilaran City", "Bohol", "city guide", "local discovery"],
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Hello Tagbilaran",
    title: "Hello Tagbilaran",
    description: "Living City Archive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hello Tagbilaran",
    description: "Living City Archive",
  },
  robots: hasProductionSiteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f4e8ce",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hello Tagbilaran",
    url: siteUrl.toString(),
    description:
      "An editorial tourism and local-discovery field journal for Tagbilaran City, Bohol.",
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <StaleServiceWorkerCleanup />
        <GlobalMotion />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
