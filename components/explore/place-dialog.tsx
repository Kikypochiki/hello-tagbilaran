"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SaveButton } from "@/components/save-button";
import { ScopeBadge } from "@/components/scope-badge";
import { categoryLabels } from "@/lib/place-labels";
import type { Place } from "@/types/content";

export function PlaceDialog({ place, onClose }: { place: Place; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="place-dialog"
      aria-labelledby="place-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <article className="place-dialog__paper">
        <header className="place-dialog__header">
          <div className="place-dialog__labels">
            <ScopeBadge scope={place.scope} />
            <span className="category-label">{categoryLabels[place.category]}</span>
          </div>
          <button
            className="place-dialog__close"
            type="button"
            onClick={closeDialog}
            aria-label={`Close information about ${place.name}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="place-dialog__title">
          <p className="section-kicker">Field entry</p>
          <h2 id="place-dialog-title">{place.name}</h2>
          <p className="place-dialog__summary">{place.summary}</p>
        </div>

        {place.story ? (
          <section aria-labelledby="place-story-title">
            <h3 id="place-story-title">The story</h3>
            <p>{place.story}</p>
          </section>
        ) : null}

        {place.address || place.barangay ? (
          <section aria-labelledby="place-location-title">
            <h3 id="place-location-title">Location note</h3>
            {place.address ? <p>{place.address}</p> : null}
            {place.barangay ? <p>Barangay: {place.barangay}</p> : null}
          </section>
        ) : null}

        {place.features.length ? (
          <section aria-labelledby="place-details-title">
            <h3 id="place-details-title">What is recorded</h3>
            <ul className="place-dialog__features">
              {place.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <aside className="place-dialog__verification">
          <strong>
            {place.verificationStatus === "source-reviewed"
              ? "Source-reviewed prototype"
              : "Local confirmation needed"}
          </strong>
          <p>
            Operating details, access conditions, and other practical information are
            omitted unless a current source supports them.
          </p>
        </aside>

        <section className="place-dialog__sources" aria-labelledby="place-sources-title">
          <h3 id="place-sources-title">Source notes</h3>
          <ul>
            {place.sources.map((source) => (
              <li key={`${source.title}-${source.accessedAt}`}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
                {source.publisher ? ` — ${source.publisher}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <footer className="place-dialog__actions">
          <SaveButton placeId={place.id} placeName={place.name} />
          <Link className="text-link" href={`/places/${place.slug}`}>
            Open shareable page <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </article>
    </dialog>
  );
}
