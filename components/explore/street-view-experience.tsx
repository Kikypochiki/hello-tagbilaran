"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { isStreetViewCurrent } from "@/lib/verification";
import type { Place } from "@/types/content";

type StreetViewStage = "zooming" | "loading" | "ready" | "unavailable";

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
  const [stage, setStage] = useState<StreetViewStage>("zooming");

  const streetViewUrl = useMemo(() => {
    if (!isStreetViewCurrent(place.streetView) || !place.streetView) return undefined;
    const parameters = new URLSearchParams({
      layer: "c",
      cbll: `${place.streetView.coordinates.latitude},${place.streetView.coordinates.longitude}`,
      cbp: "12,0,,0,0",
      source: "embed",
      output: "svembed",
      hl: "en",
    });
    return `https://maps.google.com/maps?${parameters.toString()}`;
  }, [place.streetView]);

  const queuePanoramaReveal = useCallback(() => {
    if (revealTimerRef.current) return;
    setStage("loading");
    const reducedMotion = prefersReducedMotion();
    revealTimerRef.current = window.setTimeout(() => {
      setStage("ready");
      backButtonRef.current?.focus();
    }, reducedMotion ? 0 : 420);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
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
      reducedMotion ? 0 : 620,
    );

    return () => {
      window.clearTimeout(transitionTimer);
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    };
  }, [queuePanoramaReveal, streetViewUrl]);

  function handleFrameLoad() {
    frameLoadedRef.current = true;
    if (transitionFinishedRef.current) {
      queuePanoramaReveal();
    }
  }

  return (
    <section
      className="street-view-experience"
      data-stage={stage}
      aria-labelledby="street-view-title"
      aria-describedby={stage === "ready" ? "street-view-instructions" : undefined}
    >
      {streetViewUrl ? (
        <iframe
          className="street-view-experience__panorama"
          src={streetViewUrl}
          title={`Google Street View at ${place.name}`}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={handleFrameLoad}
        />
      ) : (
        <div className="street-view-experience__panorama" />
      )}

      <div className="street-view-experience__transition" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="street-view-hud">
        <button
          ref={backButtonRef}
          type="button"
          aria-label="Go back to map"
          onClick={onClose}
        >
          <span aria-hidden="true">←</span>
          <span className="street-view-hud__back-label">Go back to map</span>
        </button>
        <div className="street-view-hud__place">
          <div className="street-view-hud__title">
            <span>Street View at</span>
            <h2 id="street-view-title">{place.name}</h2>
            {place.streetView ? (
              <small>
                {place.streetView.label}
                {" · "}
                {place.streetView.captureDate}
                {" · "}
                {place.streetView.contributor}
              </small>
            ) : null}
          </div>
          {stage === "ready" ? (
            <aside className="street-view-instructions" id="street-view-instructions">
              <strong>Look around</strong>
              <p>
                Drag or swipe to turn. Scroll or pinch to zoom. Use the map button when
                finished.
              </p>
            </aside>
          ) : null}
        </div>
      </header>

      {stage === "zooming" || stage === "loading" ? (
        <div className="street-view-loading" role="status">
          <span className="street-view-loading__route" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="street-view-loading__copy">
            <small>Street entry</small>
            <strong>
              {stage === "zooming" ? "Leaving the city map…" : "Opening the panorama…"}
            </strong>
            <span>{place.name}</span>
          </span>
        </div>
      ) : null}

      {stage === "unavailable" ? (
        <div className="street-view-fallback" role="alert">
          <p className="section-kicker">Street View unavailable</p>
          <h3>No eligible recent panorama was found.</h3>
          <p>
            This guide only opens professionally reviewed Google Maps panoramas
            dated from 2022 through 2026 that depict the listed place itself.
          </p>
          <button className="primary-action" type="button" onClick={onClose}>
            Go back to map
          </button>
        </div>
      ) : null}
    </section>
  );
}
