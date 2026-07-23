export type HazardKind = "flood" | "storm-surge" | "landslide";
export type HazardLevel = "low" | "medium" | "high";

export interface HazardClassification {
  level: HazardLevel;
  label: string;
  description: string;
  color: string;
  pattern: "dots" | "diagonal" | "crosshatch";
}

export interface HazardLayerMetadata {
  id: HazardKind;
  label: string;
  scenario: string;
  description: string;
  classifications: HazardClassification[];
  source: "UP NOAH";
  sourceUrl: string;
  status: "unavailable" | "available";
  version?: string;
  retrievedAt?: string;
  license?: string;
  dataUrl?: string;
  geometry?: GeoJSON.FeatureCollection;
}
