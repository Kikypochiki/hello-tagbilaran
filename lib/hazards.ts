import type { HazardKind, HazardLayerMetadata } from "@/types/hazards";

export function isHazardKind(value: string | null): value is HazardKind {
  return value === "flood" || value === "storm-surge" || value === "landslide";
}

export function validateHazardLayer(layer: HazardLayerMetadata) {
  if (layer.status === "available") {
    return Boolean(
      layer.version &&
      layer.retrievedAt &&
      layer.license &&
      layer.dataUrl &&
      layer.geometry?.features.length &&
      layer.classifications.length === 3,
    );
  }
  return !layer.dataUrl && !layer.geometry && layer.classifications.length === 3;
}
