import type { Metadata } from "next";
import Image from "next/image";
import { siteOwner, supportProfile } from "@/content/site-owner";

export const metadata: Metadata = {
  title: "About the project",
  description: "Meet the independent developer behind Hello Tagbilaran and learn how the guide is researched and supported.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page">
      <article className="about-journal">
        <header className="about-cover">
          <p className="about-cover__eyebrow">About the archive</p>
          <h1>The hands behind the journal.</h1>
          <p>Hello Tagbilaran is an independent, research-led city guide made to celebrate Tagbilaran on its own terms.</p>
        </header>

        <section className="developer-spread" aria-labelledby="developer-title">
          <figure className="developer-spread__portrait">
            <Image src={siteOwner.portrait.src} alt={siteOwner.portrait.alt} width={siteOwner.portrait.width} height={siteOwner.portrait.height} priority />
            <figcaption>Dohn Michael Varquez <span aria-hidden="true">·</span> Project author</figcaption>
          </figure>
          <div className="developer-spread__copy">
            <p className="developer-spread__index" aria-hidden="true">Author’s note / 01</p>
            <h2 id="developer-title">{siteOwner.displayName}</h2>
            <p className="developer-spread__role">{siteOwner.role}</p>
            <p className="developer-spread__education">{siteOwner.education}</p>
            <p>{siteOwner.biography}</p>
            <p>{siteOwner.motivation}</p>
            <div className="developer-spread__contributions">
              <h3>Work on this archive</h3>
              <ul>
                {siteOwner.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
              </ul>
            </div>
            {siteOwner.links.length ? (
              <ul className="developer-spread__links">{siteOwner.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">Visit {link.label} profile <span aria-hidden="true">↗</span></a></li>)}</ul>
            ) : null}
          </div>
        </section>

        <section className="support-spread" id="support" aria-labelledby="support-title">
          <div>
            <h2 id="support-title">Help keep the field journal growing.</h2>
            <p>Support can help cover hosting, local research, photography permissions, and accessibility improvements. It is always optional.</p>
            <dl><div><dt>Provider</dt><dd>{supportProfile.provider}</dd></div><div><dt>Recipient</dt><dd>{supportProfile.recipient}</dd></div></dl>
            {supportProfile.donationUrl && !supportProfile.placeholder ? (
              <a className="primary-action" href={supportProfile.donationUrl} target="_blank" rel="noreferrer">Open secure donation link <span aria-hidden="true">↗</span></a>
            ) : <p className="support-spread__pending" role="status">Donation destination pending. This development QR cannot be scanned.</p>}
            <small>Before confirming any payment, verify that the provider and recipient match the labels shown here. Donations are not represented as tax-deductible.</small>
          </div>
          <figure>
            <Image src={supportProfile.qr.src} alt={supportProfile.qr.alt} width={supportProfile.qr.width} height={supportProfile.qr.height} />
            <figcaption>{supportProfile.placeholder ? "Development placeholder: not a payment code" : `Scan with ${supportProfile.provider}`}</figcaption>
          </figure>
        </section>
      </article>
    </main>
  );
}
