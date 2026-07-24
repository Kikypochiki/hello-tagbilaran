import Link from "next/link";
import { siteOwner } from "@/content/site-owner";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__signature">
        <p>Living City Archive</p>
        <strong>
          Hello,
          <br />
          Tagbilaran.
        </strong>
      </div>
      <nav aria-label="Project information">
        <Link href="/">Restart the story</Link>
        <Link href="/explore">Open the city atlas</Link>
        <Link href="/hazard-assessment">Hazard assessment</Link>
        <Link href="/about">About the project</Link>
        <Link href="/about#support">Support the journal</Link>
        <a href="https://tagbilaran.gov.ph/" target="_blank" rel="noreferrer">
          Official city website <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <div className="site-footer__colophon">
        <p>Created by {siteOwner.displayName}.</p>
        <small>
          Tagbilaran City · Bohol · This is not an official city government or UP NOAH application.
        </small>
      </div>
    </footer>
  );
}
