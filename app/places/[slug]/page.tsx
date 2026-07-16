import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/save-button";
import { ScopeBadge } from "@/components/scope-badge";
import { getPlace, places } from "@/content/places";
import { categoryLabels } from "@/lib/place-labels";

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

  return (
    <main id="main-content" className="place-page">
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
            <h1>{place.name}</h1>
            <p className="place-detail__summary">{place.summary}</p>
          </div>
          <div className="place-detail__save">
            <SaveButton placeId={place.id} placeName={place.name} />
          </div>
        </header>

        <figure className="place-hero-placeholder">
          <div role="img" aria-label={`Photography placeholder for ${place.name}`}>
            <svg aria-hidden="true" viewBox="0 0 900 440" preserveAspectRatio="xMidYMid slice">
              <circle cx="690" cy="94" r="45" />
              <path d="M0 333 183 178l119 104 133-170 132 143 115-78 218 156v107H0Z" />
              <path d="M0 360c145-42 247 29 407-8 168-39 268-19 493 18" />
            </svg>
            <span>Local photography and rights record required</span>
          </div>
          <figcaption>
            Prototype image plate · Final media will include alt text, credit, rights, date,
            and geographic scope.
          </figcaption>
        </figure>

        <div className="place-detail__body">
          <section aria-labelledby="place-story-title">
            <p className="section-kicker">Place notes</p>
            <h2 id="place-story-title">The story to be told here</h2>
            <p>
              {place.story ??
                "This listing is intentionally brief while local reporting and source review are completed."}
            </p>
            <div className="feature-list" aria-label="Listing notes">
              {place.features.map((feature) => (
                <span key={feature}>{feature}</span>
              ))}
            </div>
          </section>

          <aside className="practical-note" aria-labelledby="before-you-go-title">
            <p className="section-kicker">Before you go</p>
            <h2 id="before-you-go-title">Confirm the practical details</h2>
            {place.address ? (
              <dl>
                <div>
                  <dt>Source-recorded address</dt>
                  <dd>{place.address}</dd>
                </div>
              </dl>
            ) : null}
            <p>
              Hours, prices, transport advice, contacts, and accessibility conditions are
              omitted until they receive a fresh publication check.
            </p>
            {place.coordinates ? (
              <a
                className="secondary-action"
                href={`https://www.openstreetmap.org/?mlat=${place.coordinates.latitude}&mlon=${place.coordinates.longitude}#map=17/${place.coordinates.latitude}/${place.coordinates.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Open source map <span className="sr-only">for {place.name}</span>
              </a>
            ) : (
              <p className="coordinate-note">Directions withheld pending coordinate review.</p>
            )}
          </aside>
        </div>

        <section className="source-sheet" aria-labelledby="source-title">
          <div>
            <p className="section-kicker">Editorial record</p>
            <h2 id="source-title">Sources & verification</h2>
          </div>
          <p className="verification-status" data-reviewed={place.verificationStatus === "source-reviewed" || undefined}>
            {place.verificationStatus === "source-reviewed"
              ? "Source reviewed"
              : "Local verification needed"}
          </p>
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
              </li>
            ))}
          </ul>
          <p>
            Source review does not replace an on-the-ground check of time-sensitive visitor
            information.
          </p>
        </section>
      </article>

      <nav className="place-page__back" aria-label="Continue exploring">
        <Link className="primary-action" href="/explore">
          Back to all place notes <span aria-hidden="true">←</span>
        </Link>
      </nav>
    </main>
  );
}
