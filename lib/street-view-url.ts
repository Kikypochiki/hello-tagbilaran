import type { StreetViewReference } from "@/types/content";

/**
 * Builds the legacy Google Maps Street View embed used on `main`.
 * This endpoint preserves the mobile touch behavior verified in the project.
 */
export function buildEmbeddedStreetViewUrl(
  streetView: StreetViewReference,
): string {
  const parameters = new URLSearchParams({
    layer: "c",
    cbll: `${streetView.coordinates.latitude},${streetView.coordinates.longitude}`,
    cbp: "12,0,,0,0",
    source: "embed",
    output: "svembed",
    hl: "en",
  });

  return `https://maps.google.com/maps?${parameters.toString()}`;
}
