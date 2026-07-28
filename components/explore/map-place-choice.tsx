"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { categoryLabels, scopeLabels } from "@/lib/place-labels";
import { buildInteractiveStreetViewUrl } from "@/lib/street-view-url";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingId = `map-place-choice-${place.id}`;
  const streetViewAvailable = isStreetViewCurrent(place.streetView);
  const mobileStreetViewUrl =
    streetViewAvailable && place.streetView
      ? buildInteractiveStreetViewUrl(place.streetView)
      : undefined;

  useEffect(() => {
    closeButtonRef.current?.focus();

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
          ref={closeButtonRef}
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
        <span>{categoryLabels[place.category]}</span>
      </p>
      <div className="map-place-choice__actions">
        <button className="secondary-action" type="button" onClick={onDetails}>
          About this place
        </button>
        {streetViewAvailable && mobileStreetViewUrl ? (
          <>
            <button
              className="primary-action map-place-choice__street-view-desktop"
              type="button"
              onClick={onStreetView}
            >
              Street View <span aria-hidden="true">→</span>
            </button>
            <a
              className="primary-action map-place-choice__street-view-mobile"
              href={mobileStreetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open interactive Street View ${
                place.streetView?.match === "exact-venue" ? "at" : "near"
              } ${place.name}`}
            >
              Open Street View <span aria-hidden="true">↗</span>
            </a>
          </>
        ) : (
          <p className="map-place-choice__street-view-note">
            No qualifying recent panorama is available at or near this place.
          </p>
        )}
      </div>
    </aside>,
    mountNode,
  );
}
