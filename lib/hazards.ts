import type { HazardKind, HazardLayerMetadata } from "@/types/hazards";

export function isHazardKind(value: string | null): value is HazardKind {
  return value === "flood" || value === "storm-surge" || value === "landslide";
}

export function validateHazardLayer(layer: HazardLayerMetadata) {
  return Boolean(
    layer.status === "available" &&
      layer.version &&
      /^\d{4}-\d{2}-\d{2}$/.test(layer.retrievedAt) &&
      layer.license === "ODC-ODbL-1.0" &&
      layer.dataUrl.startsWith("/data/hazards/") &&
      layer.sourceUrl.startsWith("https://noah.up.edu.ph/") &&
      layer.dataRepositoryUrl.startsWith("https://") &&
      layer.classifications.length === 3,
  );
}
