export type HazardKind = "flood" | "storm-surge" | "landslide";
export type HazardLevel = "low" | "medium" | "high";

export interface HazardLayerMetadata {
  id: HazardKind;
  label: string;
  scenario: string;
  description: string;
  source: "UP NOAH";
  sourceUrl: string;
  status: "unavailable" | "available";
  version?: string;
  retrievedAt?: string;
  license?: string;
  dataUrl?: string;
}
