import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

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
  title: {
    default: "Hello Tagbilaran",
    template: "%s · Hello Tagbilaran",
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
    description: "Where every street leads to a story.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hello Tagbilaran",
    description: "Where every street leads to a story.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4e8ce",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div>
            <strong>Hello Tagbilaran</strong>
            <p>A working city journal. Local verification is part of the design.</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/">Story</Link>
            <Link href="/explore">Explore</Link>
          </nav>
          <p className="site-footer__note">Prototype milestone · Not yet a travel advisory</p>
        </footer>
      </body>
    </html>
  );
}
