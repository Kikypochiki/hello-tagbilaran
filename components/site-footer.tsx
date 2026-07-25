import Link from "next/link";
import { siteOwner } from "@/content/site-owner";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__signature">
          <Link href="/">Hello Tagbilaran</Link>
          <p>Living City Archive</p>
        </div>
        <nav aria-label="Project information">
          <Link href="/">Story</Link>
          <Link href="/explore">City atlas</Link>
          <Link href="/hazard-assessment">Hazard assessment</Link>
          <Link href="/about">About and support</Link>
          <a href="https://tagbilaran.gov.ph/" target="_blank" rel="noreferrer">
            Official city website <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="site-footer__colophon">
          <p>Created by {siteOwner.displayName}.</p>
          <small>
            Independent from the City Government of Tagbilaran and UP NOAH.
          </small>
        </div>
      </div>
    </footer>
  );
}
