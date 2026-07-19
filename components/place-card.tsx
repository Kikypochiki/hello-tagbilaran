import Image from "next/image";
import Link from "next/link";
import { categoryLabels } from "@/lib/place-labels";
import { hasReviewedLocation } from "@/lib/verification";
import type { Place } from "@/types/content";
import { PlaceVerificationNote } from "./place-verification-note";
import { SaveButton } from "./save-button";
import { ScopeBadge } from "./scope-badge";

export function PlaceCard({
  place,
  selected = false,
  onSelectId,
}: {
  place: Place;
  selected?: boolean;
  onSelectId?: string;
}) {
  const leadImage = place.images[0];

  return (
    <article
      className="place-card"
      data-selected={selected || undefined}
      id={`place-${place.id}`}
    >
      {leadImage ? (
        <div className="place-card__photo">
          <Image
            src={leadImage.src}
            alt={leadImage.alt}
            width={leadImage.width}
            height={leadImage.height}
            sizes="(max-width: 780px) 94vw, 360px"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="place-card__content">
        <div className="place-card__labels">
          <ScopeBadge scope={place.scope} />
          <span className="category-label">{categoryLabels[place.category]}</span>
        </div>
        <h2>
          <Link href={`/places/${place.slug}`}>{place.name}</Link>
        </h2>
        <PlaceVerificationNote place={place} compact />
        <p>{place.summary}</p>
        <div className="place-card__actions">
          <Link className="text-link" href={`/places/${place.slug}`}>
            View details <span aria-hidden="true">→</span>
          </Link>
          {hasReviewedLocation(place) && place.directionsUrl ? (
            <a
              className="text-link"
              href={place.directionsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Google Maps <span className="sr-only">for {place.name}</span>
            </a>
          ) : null}
          <SaveButton placeId={place.id} placeName={place.name} />
          {onSelectId ? (
            <a className="sr-only" href={`#${onSelectId}`}>
              Return to selected map place
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
