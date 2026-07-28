"use client";

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { hazardLayers } from "@/content/hazards";
import { tagbilaranBarangays } from "@/content/barangays";
import { isHazardKind } from "@/lib/hazards";
import type {
  HazardInspection,
  HazardKind,
  HazardLevel,
} from "@/types/hazards";

const HazardMap = dynamic(
  () => import("./hazard-map").then((module) => module.HazardMap),
  {
    ssr: false,
    loading: () => (
      <div className="hazard-map-loading" role="status">
        <span />
        Loading hazard map
      </div>
    ),
  },
);

const allLevels: HazardLevel[] = ["low", "medium", "high"];

export function HazardAssessmentClient() {
  const indexRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hazardParam = searchParams.get("hazard");
  const activeHazard: HazardKind = isHazardKind(hazardParam)
    ? hazardParam
    : "flood";
  const selectedCode = searchParams.get("barangay");
  const selectedBarangay = useMemo(
    () =>
      tagbilaranBarangays.find((barangay) => barangay.code === selectedCode),
    [selectedCode],
  );
  const activeLayer =
    hazardLayers.find((layer) => layer.id === activeHazard) ?? hazardLayers[0];
  const [opacity, setOpacity] = useState(66);
  const [visibleLevels, setVisibleLevels] =
    useState<HazardLevel[]>(allLevels);
  const [inspection, setInspection] = useState<HazardInspection>();
  const [dataState, setDataState] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (window.matchMedia("(max-width: 780px)").matches && indexRef.current) {
      indexRef.current.open = false;
    }
  }, []);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const suffix = next.toString();
      window.history.replaceState(
        null,
        "",
        suffix ? `${pathname}?${suffix}` : pathname,
      );
    },
    [pathname, searchParams],
  );

  const handleHazardChange = useCallback(
    (hazard: HazardKind) => {
      setInspection(undefined);
      setVisibleLevels(allLevels);
      replaceParams({ hazard });
    },
    [replaceParams],
  );
  const handleBarangayChange = useCallback(
    (code?: string) => replaceParams({ barangay: code ?? null }),
    [replaceParams],
  );
  const handleInspect = useCallback(
    (next?: HazardInspection) => setInspection(next),
    [],
  );
  const handleDataState = useCallback(
    (next: "loading" | "ready" | "error") => setDataState(next),
    [],
  );

  function toggleLevel(level: HazardLevel) {
    setVisibleLevels((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level],
    );
  }

  return (
    <section
      className="hazard-map-workspace"
      aria-label="Tagbilaran hazard assessment map"
    >
      <h1 className="sr-only">Tagbilaran hazard assessment</h1>

      <details className="hazard-map-index" ref={indexRef} open>
        <summary>
          <span className="hazard-map-index__summary">
            <strong>Hazard map</strong>
            <small>
              {activeLayer.label.replace(" susceptibility", "")} ·{" "}
              {activeLayer.shortScenario}
            </small>
          </span>
          <span className="hazard-map-index__toggle" aria-hidden="true">
            <span data-when-open>Close</span>
            <span data-when-closed>Open</span>
          </span>
        </summary>

        <div className="hazard-map-index__body">
          <section aria-labelledby="hazard-controls-title">
            <header className="hazard-map-index__intro">
              <small>Project NOAH · Tagbilaran City</small>
              <h2 id="hazard-controls-title">Read one scenario at a time.</h2>
            </header>

            <fieldset className="hazard-control-group">
              <legend>Hazard</legend>
              <div className="hazard-kind-choices">
                {hazardLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    aria-pressed={layer.id === activeHazard}
                    onClick={() => handleHazardChange(layer.id)}
                  >
                    <span>{layer.label.replace(" susceptibility", "")}</span>
                    <small>{layer.shortScenario}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="hazard-select">
              <span>Area</span>
              <select
                value={selectedBarangay?.code ?? ""}
                onChange={(event) =>
                  handleBarangayChange(event.target.value || undefined)
                }
              >
                <option value="">Whole Tagbilaran City</option>
                {tagbilaranBarangays.map((barangay) => (
                  <option value={barangay.code} key={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="hazard-control-group hazard-level-controls">
              <legend>Visible classifications</legend>
              {activeLayer.classifications.map((classification) => (
                <label key={classification.level}>
                  <input
                    type="checkbox"
                    checked={visibleLevels.includes(classification.level)}
                    onChange={() => toggleLevel(classification.level)}
                  />
                  <i
                    data-level={classification.level}
                    aria-hidden="true"
                    style={
                      {
                        "--hazard-swatch": classification.color,
                      } as CSSProperties
                    }
                  />
                  <span>{classification.label}</span>
                </label>
              ))}
            </fieldset>

            <label className="hazard-opacity-control">
              <span>
                Layer opacity <b>{opacity}%</b>
              </span>
              <input
                type="range"
                min="20"
                max="90"
                value={opacity}
                onChange={(event) => setOpacity(Number(event.target.value))}
              />
            </label>

            <details className="hazard-source-note">
              <summary>Source and limitations</summary>
              <div>
                <p>{activeLayer.description}</p>
                <p>
                  This is a scenario map, not a live warning or a guarantee of
                  safety. Boundaries and classifications require local
                  verification.
                </p>
                <dl>
                  <div>
                    <dt>Source</dt>
                    <dd>{activeLayer.source}</dd>
                  </div>
                  <div>
                    <dt>Retrieved</dt>
                    <dd>{activeLayer.retrievedAt}</dd>
                  </div>
                  <div>
                    <dt>License</dt>
                    <dd>{activeLayer.license}</dd>
                  </div>
                </dl>
                <a
                  href={activeLayer.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify with UP NOAH <span aria-hidden="true">↗</span>
                </a>
              </div>
            </details>
          </section>
        </div>
      </details>

      <HazardMap
        layer={activeLayer}
        opacity={opacity}
        visibleLevels={visibleLevels}
        selectedBarangayCode={selectedBarangay?.code}
        onSelectBarangay={handleBarangayChange}
        onInspect={handleInspect}
        onDataState={handleDataState}
      />

      <aside className="hazard-map-legend" aria-label="Hazard legend">
        <span>{activeLayer.label}</span>
        <div>
          {activeLayer.classifications.map((classification) => (
            <span
              key={classification.level}
              aria-hidden={!visibleLevels.includes(classification.level)}
            >
              <i
                data-level={classification.level}
                style={
                  {
                    "--hazard-swatch": classification.color,
                  } as CSSProperties
                }
              />
              {classification.label}
            </span>
          ))}
        </div>
      </aside>

      <div
        className="hazard-map-status"
        data-state={dataState}
        aria-live="polite"
      >
        {dataState === "loading" ? (
          <span>Loading {activeLayer.label.toLowerCase()}…</span>
        ) : dataState === "error" ? (
          <span>Hazard layer could not be loaded. Use the UP NOAH link.</span>
        ) : inspection ? (
          <>
            <small>
              {selectedBarangay?.name ?? "Selected map point"} ·{" "}
              {activeLayer.shortScenario}
            </small>
            <strong>{inspection.label} classification</strong>
            <span>{inspection.description}</span>
          </>
        ) : (
          <span>Select a mapped area to inspect its classification.</span>
        )}
      </div>
    </section>
  );
}
