import Link from "next/link";
import { siteOwner } from "@/content/site-owner";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Hello Tagbilaran</strong>
        <p>An independent field journal by {siteOwner.displayName}.</p>
      </div>
      <nav aria-label="Project information">
        <Link href="/about">About the project</Link>
        <Link href="/hazard-assessment">Hazard assessment</Link>
        <Link href="/about#support">Support</Link>
        <a href="https://tagbilaran.gov.ph/" target="_blank" rel="noreferrer">Official city website <span aria-hidden="true">↗</span></a>
      </nav>
      <small>Tagbilaran City · Bohol · This is not an official city government or UP NOAH application.</small>
    </footer>
  );
}
