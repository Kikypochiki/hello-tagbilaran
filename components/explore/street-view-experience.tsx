"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { isStreetViewCurrent } from "@/lib/verification";
import type { Place } from "@/types/content";

type StreetViewStage = "zooming" | "loading" | "ready" | "unavailable";

const mapApproachDuration = 900;
const panoramaRevealDelay = 320;
const panoramaTimeout = 12_000;

export function StreetViewExperience({
  place,
  onClose,
}: {
  place: Place;
  onClose: () => void;
}) {
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const transitionFinishedRef = useRef(false);
  const frameLoadedRef = useRef(false);
  const revealTimerRef = useRef<number | undefined>(undefined);
  const failureTimerRef = useRef<number | undefined>(undefined);
  const [stage, setStage] = useState<StreetViewStage>("zooming");

  const streetViewUrl = useMemo(() => {
    if (!isStreetViewCurrent(place.streetView) || !place.streetView) return undefined;
    const parameters = new URLSearchParams({
      layer: "c",
      cbll: `${place.streetView.coordinates.latitude},${place.streetView.coordinates.longitude}`,
      cbp: `12,${place.streetView.heading ?? 0},,0,0`,
      source: "embed",
      output: "svembed",
      hl: "en",
    });
    return `https://maps.google.com/maps?${parameters.toString()}`;
  }, [place.streetView]);

  const queuePanoramaReveal = useCallback(() => {
    if (revealTimerRef.current) return;
    setStage("loading");
    revealTimerRef.current = window.setTimeout(() => {
      setStage("ready");
    }, prefersReducedMotion() ? 0 : panoramaRevealDelay);
  }, []);

  useEffect(() => {
    backButtonRef.current?.focus();

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior =
      document.body.style.overscrollBehavior;
    const previousDocumentOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      document.documentElement.style.overscrollBehavior =
        previousDocumentOverscrollBehavior;
    };
  }, [onClose]);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    const transitionTimer = window.setTimeout(
      () => {
        transitionFinishedRef.current = true;
        if (!streetViewUrl) {
          setStage("unavailable");
        } else if (frameLoadedRef.current) {
          queuePanoramaReveal();
        } else {
          setStage("loading");
        }
      },
      reducedMotion ? 0 : mapApproachDuration,
    );

    failureTimerRef.current = window.setTimeout(() => {
      if (!frameLoadedRef.current) setStage("unavailable");
    }, panoramaTimeout);

    return () => {
      window.clearTimeout(transitionTimer);
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
      if (failureTimerRef.current) window.clearTimeout(failureTimerRef.current);
    };
  }, [queuePanoramaReveal, streetViewUrl]);

  function handleFrameLoad() {
    frameLoadedRef.current = true;
    if (failureTimerRef.current) window.clearTimeout(failureTimerRef.current);
    if (transitionFinishedRef.current) queuePanoramaReveal();
  }

  const locationLabel =
    place.streetView?.match === "exact-venue" ? "At the place" : "Nearby road";

  return (
    <section
      className="street-view-experience"
      data-stage={stage}
      role="dialog"
      aria-modal="true"
      aria-labelledby="street-view-title"
      aria-describedby="street-view-caption"
    >
      {streetViewUrl ? (
        <iframe
          className="street-view-experience__panorama"
          src={streetViewUrl}
          title={`Google Street View ${
            place.streetView?.match === "exact-venue" ? "at" : "near"
          } ${place.name}`}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleFrameLoad}
          tabIndex={stage === "ready" ? 0 : -1}
          allowFullScreen
        />
      ) : (
        <div className="street-view-experience__panorama" />
      )}

      <div className="street-view-experience__transition" aria-hidden="true">
        <span className="street-view-experience__focus-ring" />
        <span className="street-view-experience__focus-ring street-view-experience__focus-ring--inner" />
        <span className="street-view-experience__focus-point" />
      </div>
      <div className="street-view-experience__paper-gate" aria-hidden="true" />

      <header className="street-view-hud">
        <button
          ref={backButtonRef}
          type="button"
          aria-label="Go back to map"
          onClick={onClose}
        >
          <span className="street-view-hud__back-arrow" aria-hidden="true">
            ←
          </span>
          <span className="street-view-hud__back-label">Map</span>
        </button>
      </header>

      <aside
        className="street-view-caption"
        id="street-view-caption"
        aria-live="polite"
      >
        <p>{locationLabel}</p>
        <h2 id="street-view-title">{place.name}</h2>
        {place.streetView ? (
          <small>
            {place.streetView.label}
            {" · "}
            {place.streetView.captureDate}
            {place.streetView.match === "nearby-road" &&
            place.streetView.distanceMeters
              ? ` · ${place.streetView.distanceMeters} m away`
              : ""}
          </small>
        ) : null}
        <span className="street-view-caption__instruction">
          Drag to look around · pinch or scroll to zoom
        </span>
      </aside>

      {stage === "zooming" || stage === "loading" ? (
        <div className="street-view-loading" role="status">
          <span className="street-view-loading__copy">
            <small>{stage === "zooming" ? "Approaching" : "Opening street view"}</small>
            <strong>{place.name}</strong>
            <span className="street-view-loading__line" aria-hidden="true">
              <i />
            </span>
            <span>
              {stage === "zooming"
                ? "Moving from the city atlas to the street."
                : "The panorama is coming into focus."}
            </span>
          </span>
        </div>
      ) : null}

      {stage === "unavailable" ? (
        <div className="street-view-fallback" role="alert">
          <p className="section-kicker">Street View unavailable</p>
          <h3>The street could not be opened.</h3>
          <p>
            The reviewed panorama did not load. Return to the city atlas and try
            again when the connection is stable.
          </p>
          <button className="primary-action" type="button" onClick={onClose}>
            Go back to map
          </button>
        </div>
      ) : null}
    </section>
  );
}
