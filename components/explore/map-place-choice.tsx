"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import type { Place } from "@/types/content";

export interface MapChoiceAnchor {
  x: number;
  y: number;
  placement: "above" | "below";
}

export function MapPlaceChoice({
  place,
  anchor,
  onClose,
  onDetails,
  onStreetView,
}: {
  place: Place;
  anchor: MapChoiceAnchor;
  onClose: () => void;
  onDetails: () => void;
  onStreetView: () => void;
}) {
  const detailsButtonRef = useRef<HTMLButtonElement>(null);
  const style = {
    "--map-choice-x": `${anchor.x}px`,
    "--map-choice-y": `${anchor.y}px`,
  } as CSSProperties;

  useEffect(() => {
    detailsButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <aside
      className="map-place-choice"
      data-placement={anchor.placement}
      style={style}
      aria-label={`Options for ${place.name}`}
    >
      <span className="sr-only">Choose how to explore {place.name}</span>
      <div className="map-place-choice__actions">
        <button
          ref={detailsButtonRef}
          className="secondary-action"
          type="button"
          onClick={onDetails}
        >
          View details
        </button>
        <button className="primary-action" type="button" onClick={onStreetView}>
          Street View <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}
