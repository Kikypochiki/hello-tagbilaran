import type { StreetViewReference } from "@/types/content";

/**
 * Opens Google's full interactive panorama surface. Maps URLs are intentionally
 * used for touch devices because the provider can route them to either the Maps
 * app or its mobile web viewer without trapping gestures inside an iframe.
 */
export function buildInteractiveStreetViewUrl(
  streetView: StreetViewReference,
): string {
  const parameters = new URLSearchParams({
    api: "1",
    map_action: "pano",
    viewpoint: `${streetView.coordinates.latitude},${streetView.coordinates.longitude}`,
    heading: `${streetView.heading ?? 0}`,
    pitch: "0",
    fov: "80",
  });

  return `https://www.google.com/maps/@?${parameters.toString()}`;
}
