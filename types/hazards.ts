export type HazardKind = "flood" | "storm-surge" | "landslide";
export type HazardLevel = "low" | "medium" | "high";
export type HazardScenarioId =
  | "flood-100yr"
  | "landslide-susceptibility"
  | "storm-surge-ssa4";

export interface HazardClassification {
  level: HazardLevel;
  label: string;
  description: string;
  color: string;
  pattern: "dots" | "diagonal" | "crosshatch";
}

export interface HazardLayerMetadata {
  id: HazardKind;
  scenarioId: HazardScenarioId;
  label: string;
  scenario: string;
  shortScenario: string;
  description: string;
  classifications: HazardClassification[];
  source: "Project NOAH";
  sourceUrl: string;
  dataRepositoryUrl: string;
  status: "available";
  version: string;
  retrievedAt: string;
  license: "ODC-ODbL-1.0";
  dataUrl: string;
}

export interface HazardInspection {
  level: HazardLevel;
  label: string;
  description: string;
}
