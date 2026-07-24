"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { categoryLabels, scopeLabels } from "@/lib/place-labels";
import { isStreetViewCurrent } from "@/lib/verification";
import type { Place } from "@/types/content";

export function MapPlaceChoice({
  place,
  mountNode,
  onClose,
  onDetails,
  onStreetView,
}: {
  place: Place;
  mountNode: HTMLElement;
  onClose: () => void;
  onDetails: () => void;
  onStreetView: () => void;
}) {
  const detailsButtonRef = useRef<HTMLButtonElement>(null);
  const headingId = `map-place-choice-${place.id}`;
  const streetViewAvailable = isStreetViewCurrent(place.streetView);

  useEffect(() => {
    detailsButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return createPortal(
    <aside
      className="map-place-choice"
      aria-labelledby={headingId}
    >
      <header className="map-place-choice__heading">
        <div>
          <h2 id={headingId}>{place.name}</h2>
        </div>
        <button
          className="map-place-choice__close"
          type="button"
          aria-label={`Close options for ${place.name}`}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <p className="map-place-choice__meta">
        <span>{scopeLabels[place.scope]}</span>
        <span aria-hidden="true">·</span>
        <span>{categoryLabels[place.category]}</span>
      </p>
      <div className="map-place-choice__actions">
        <button
          ref={detailsButtonRef}
          className="secondary-action"
          type="button"
          onClick={onDetails}
        >
          View details
        </button>
        {streetViewAvailable ? (
          <button className="primary-action" type="button" onClick={onStreetView}>
            Street View <span aria-hidden="true">→</span>
          </button>
        ) : (
          <p className="map-place-choice__street-view-note">
            No current panorama has been verified at this exact place.
          </p>
        )}
      </div>
    </aside>,
    mountNode,
  );
}
