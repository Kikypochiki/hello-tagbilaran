import type { StreetViewReference } from "@/types/content";

/**
 * Builds the interactive panorama URL produced by Google Maps' embed surface.
 * Unlike the legacy `output=svembed` endpoint, this viewer accepts native touch
 * gestures when it is hosted in an iframe.
 */
export function buildEmbeddedStreetViewUrl(
  streetView: StreetViewReference,
): string {
  const panoramaParameters = [
    "!4v1",
    "!6m8",
    "!1m7",
    `!1s${encodeURIComponent(streetView.panoId)}`,
    "!2m2",
    `!1d${streetView.coordinates.latitude}`,
    `!2d${streetView.coordinates.longitude}`,
    `!3f${streetView.heading ?? 0}`,
    "!4f0",
    "!5f0.7820865974627469",
  ].join("");

  return `https://www.google.com/maps/embed?pb=${panoramaParameters}`;
}
