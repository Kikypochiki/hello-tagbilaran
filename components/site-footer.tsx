import Link from "next/link";
import { siteOwner } from "@/content/site-owner";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="section-kicker">Independent field journal</p>
        <strong>Hello Tagbilaran</strong>
        <p>Designed and developed by {siteOwner.displayName}.</p>
      </div>
      <nav aria-label="Project information">
        <Link href="/about">About the project</Link>
        <Link href="/about#support">Support</Link>
        <a href="https://tagbilaran.gov.ph/" target="_blank" rel="noreferrer">Official city website <span aria-hidden="true">↗</span></a>
      </nav>
      <small>This independent guide is not an official City Government of Tagbilaran or UP NOAH application.</small>
    </footer>
  );
}
