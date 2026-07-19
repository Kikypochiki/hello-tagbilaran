import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceVerificationNote } from "@/components/place-verification-note";
import { SaveButton } from "@/components/save-button";
import { ScopeBadge } from "@/components/scope-badge";
import { getPlace, places } from "@/content/places";
import { categoryLabels } from "@/lib/place-labels";
import { hasReviewedLocation } from "@/lib/verification";

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return { title: "Place not found" };

  return {
    title: place.name,
    description: place.summary,
    alternates: { canonical: `/places/${place.slug}` },
    openGraph:
      place.images[0] && place.verification.mediaRights === "cleared"
      ? {
          title: place.name,
          description: place.summary,
          images: [{ url: place.images[0].src, alt: place.images[0].alt }],
        }
      : undefined,
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();
  const leadImage = place.images[0];
  const reviewedLocation = hasReviewedLocation(place);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    description: place.summary,
    image:
      leadImage && place.verification.mediaRights === "cleared"
        ? leadImage.src
        : undefined,
    address: reviewedLocation ? place.address : undefined,
    geo:
      reviewedLocation && place.coordinates
        ? {
            "@type": "GeoCoordinates",
            latitude: place.coordinates.latitude,
            longitude: place.coordinates.longitude,
          }
        : undefined,
  };

  return (
    <main id="main-content" className="place-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Story</Link>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>
          <li aria-current="page">{place.name}</li>
        </ol>
      </nav>

      <article className="place-detail">
        <header className="place-detail__header">
          <div>
            <div className="place-detail__labels">
              <ScopeBadge scope={place.scope} />
              <span className="category-label">{categoryLabels[place.category]}</span>
            </div>
            <PlaceVerificationNote place={place} />
            <h1>{place.name}</h1>
            <p className="place-detail__summary">{place.summary}</p>
          </div>
          <div className="place-detail__save">
            <SaveButton placeId={place.id} placeName={place.name} />
          </div>
        </header>

        {leadImage ? (
          <figure className="place-hero">
            <Image
              src={leadImage.src}
              alt={leadImage.alt}
              width={leadImage.width}
              height={leadImage.height}
              sizes="(max-width: 780px) calc(100vw - 2rem), min(1180px, 90vw)"
              priority
            />
            <figcaption>
              Photo: {leadImage.credit ?? "Credit not supplied"}
              {leadImage.rights ? ` · ${leadImage.rights}` : null}
            </figcaption>
          </figure>
        ) : null}

        <div className="place-detail__body">
          <section aria-labelledby="place-about-title">
            <p className="section-kicker">About this place</p>
            <h2 id="place-about-title">Why it belongs in the guide</h2>
            <p>{place.story ?? place.summary}</p>
            <div className="feature-list" aria-label="Place highlights">
              {place.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
          </section>

          <aside className="practical-note" aria-labelledby="before-you-go-title">
            <p className="section-kicker">Plan your stop</p>
            <h2 id="before-you-go-title">Location &amp; visit notes</h2>
            {place.address || place.barangay ? (
              <dl>
                {place.address ? (
                  <div>
                    <dt>Address</dt>
                    <dd>{place.address}</dd>
                  </div>
                ) : null}
                {place.barangay ? (
                  <div>
                    <dt>{place.scope === "tagbilaran" ? "Barangay" : "Area"}</dt>
                    <dd>{place.barangay}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            {place.localTip ? <p className="place-local-tip">{place.localTip}</p> : null}
            <p className="practical-note__check">
              Unconfirmed opening times, prices, contacts, and access conditions are
              intentionally omitted. Check directly with the place before visiting.
            </p>
            {reviewedLocation && place.directionsUrl ? (
              <a
                className="secondary-action"
                href={place.directionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps <span className="sr-only">for {place.name}</span>
              </a>
            ) : null}
          </aside>
        </div>

        <details className="source-sheet">
          <summary>
            <span>
              <span className="section-kicker">Sources</span>
              <strong>View research and photo notes</strong>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <ul>
            {place.sources.map((source) => (
              <li key={`${source.title}-${source.accessedAt}`}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                ) : (
                  <span>{source.title}</span>
                )}
                {source.publisher ? ` · ${source.publisher}` : ""}
                <small>Accessed {source.accessedAt}</small>
                {source.notes ? <small>{source.notes}</small> : null}
              </li>
            ))}
          </ul>
        </details>
      </article>

      <nav className="place-page__back" aria-label="Continue exploring">
        <Link className="primary-action" href="/explore">
          Back to the city map <span aria-hidden="true">←</span>
        </Link>
      </nav>
    </main>
  );
}
