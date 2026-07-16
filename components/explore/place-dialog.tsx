"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SaveButton } from "@/components/save-button";
import { ScopeBadge } from "@/components/scope-badge";
import { categoryLabels } from "@/lib/place-labels";
import type { Place } from "@/types/content";

export function PlaceDialog({ place, onClose }: { place: Place; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const leadImage = place.images[0];

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
          <p className="section-kicker">Field register entry</p>
          <h2 id="place-dialog-title">{place.name}</h2>
          <p className="place-dialog__summary">{place.summary}</p>
        </div>

        {leadImage ? (
          <figure className="place-dialog__figure">
            <Image
              src={leadImage.src}
              alt={leadImage.alt}
              width={leadImage.width}
              height={leadImage.height}
              sizes="(max-width: 780px) 88vw, 640px"
            />
            <figcaption>
              Photo: {leadImage.credit ?? "Credit not supplied"}
              {leadImage.rights ? ` · ${leadImage.rights}` : null}
            </figcaption>
          </figure>
        ) : null}

        {place.address || place.barangay ? (
          <section aria-labelledby="place-location-title">
            <h3 id="place-location-title">Location record</h3>
            {place.address ? <p>{place.address}</p> : null}
            {place.barangay ? <p>Barangay: {place.barangay}</p> : null}
          </section>
        ) : null}

        {place.features.length ? (
          <section aria-labelledby="place-details-title">
            <h3 id="place-details-title">What the register records</h3>
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
              ? "Source record reviewed"
              : "Local confirmation needed"}
          </strong>
          <p>
            {place.accessibility?.verificationNotes ??
              "Current operating and access details still require local confirmation."}
          </p>
          <p>
            Hours, prices, schedules, contacts, and accessibility claims are not shown
            unless a current authoritative source publishes them.
          </p>
        </aside>

        <section className="place-dialog__sources" aria-labelledby="place-sources-title">
          <h3 id="place-sources-title">Sources &amp; review notes</h3>
          <ol>
            {place.sources.map((source) => (
              <li key={`${source.title}-${source.accessedAt}`}>
                <p>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                  {source.publisher ? ` · ${source.publisher}` : ""}
                </p>
                <small>Accessed {source.accessedAt}</small>
                {source.notes ? <small>{source.notes}</small> : null}
              </li>
            ))}
          </ol>
        </section>

        <footer className="place-dialog__actions">
          <SaveButton placeId={place.id} placeName={place.name} />
          <div className="place-dialog__links">
            {place.directionsUrl ? (
              <a className="secondary-action" href={place.directionsUrl} target="_blank" rel="noreferrer">
                Directions <span className="sr-only">for {place.name}</span>
              </a>
            ) : null}
            <Link className="text-link" href={`/places/${place.slug}`}>
              Shareable page <span aria-hidden="true">→</span>
            </Link>
          </div>
        </footer>
      </article>
    </dialog>
  );
}
