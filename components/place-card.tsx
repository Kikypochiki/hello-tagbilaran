import Link from "next/link";
import { categoryLabels } from "@/lib/place-labels";
import type { Place } from "@/types/content";
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
  return (
    <article
      className="place-card"
      data-selected={selected || undefined}
      id={`place-${place.id}`}
    >
      <div className="place-card__photo" aria-hidden="true">
        <span>{categoryLabels[place.category]}</span>
        <svg viewBox="0 0 300 150" preserveAspectRatio="none">
          <path d="M0 118 54 83l35 21 48-57 35 42 39-25 89 54v32H0Z" />
          <path d="M0 126c52-14 82 4 134-2 68-8 87-22 166-6v32H0Z" />
        </svg>
      </div>
      <div className="place-card__content">
        <div className="place-card__labels">
          <ScopeBadge scope={place.scope} />
          <span className="category-label">{categoryLabels[place.category]}</span>
        </div>
        <h2>
          <Link href={`/places/${place.slug}`}>{place.name}</Link>
        </h2>
        <p>{place.summary}</p>
        <p className="verification-note">
          {place.verificationStatus === "source-reviewed"
            ? "Source reviewed · practical details still require a launch check"
            : "Prototype listing · local verification needed"}
        </p>
        <div className="place-card__actions">
          <Link className="text-link" href={`/places/${place.slug}`}>
            Read place notes <span aria-hidden="true">→</span>
          </Link>
          {place.coordinates ? (
            <a
              className="text-link"
              href={`https://www.openstreetmap.org/?mlat=${place.coordinates.latitude}&mlon=${place.coordinates.longitude}#map=17/${place.coordinates.latitude}/${place.coordinates.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              Open map <span className="sr-only">for {place.name}</span>
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
