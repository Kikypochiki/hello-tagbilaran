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
          <p className="section-kicker">Colophon · Field journal no. 01</p>
          <h1>The hands behind the journal.</h1>
          <p>Hello Tagbilaran is an independent, research-led city guide made to celebrate Tagbilaran on its own terms.</p>
        </header>

        <section className="developer-spread" aria-labelledby="developer-title">
          <figure>
            <Image src={siteOwner.portrait.src} alt={siteOwner.portrait.alt} width={siteOwner.portrait.width} height={siteOwner.portrait.height} priority />
            {siteOwner.placeholder ? <figcaption>Development placeholder · portrait and profile pending</figcaption> : null}
          </figure>
          <div>
            <p className="section-kicker">Developer</p>
            <h2 id="developer-title">{siteOwner.displayName}</h2>
            <p className="developer-spread__role">{siteOwner.role}</p>
            <p>{siteOwner.biography}</p>
            <p>{siteOwner.motivation}</p>
            {siteOwner.links.length ? (
              <ul>{siteOwner.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a></li>)}</ul>
            ) : null}
          </div>
        </section>

        <section className="project-method" aria-labelledby="method-title">
          <p className="section-kicker">How the guide is made</p>
          <h2 id="method-title">A public notebook, carefully sourced.</h2>
          <div>
            <p><strong>Local focus.</strong> Tagbilaran is presented as a living city, not simply a gateway to wider Bohol.</p>
            <p><strong>Clear geography.</strong> Every place is labeled Tagbilaran City, Nearby, or Bohol Day Trip.</p>
            <p><strong>Verification.</strong> Time-sensitive facts are omitted or visibly qualified until reviewed.</p>
            <p><strong>Accessible by design.</strong> Core stories and place information remain readable without gestures, WebGL, or animation.</p>
          </div>
          <aside>This project is not affiliated with or endorsed by the City Government of Tagbilaran, UP NOAH, or businesses included in the guide.</aside>
        </section>

        <section className="support-spread" id="support" aria-labelledby="support-title">
          <div>
            <p className="section-kicker">Optional support</p>
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
            <figcaption>{supportProfile.placeholder ? "Development placeholder · not a payment code" : `Scan with ${supportProfile.provider}`}</figcaption>
          </figure>
        </section>
      </article>
    </main>
  );
}
