"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hazardLayers } from "@/content/hazards";
import { tagbilaranBarangays } from "@/content/barangays";
import { isHazardKind } from "@/lib/hazards";
import type { Place } from "@/types/content";
import type { HazardKind } from "@/types/hazards";

const HazardMap = dynamic(
  () => import("@/components/explore/map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="hazard-map__loading" role="status">
        Preparing the city boundary map…
      </div>
    ),
  },
);

const noPlaces: Place[] = [];
const noPlaceIds: string[] = [];

export function HazardAssessmentClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hazardParam = searchParams.get("hazard");
  const activeHazard: HazardKind = isHazardKind(hazardParam) ? hazardParam : "flood";
  const selectedCode = searchParams.get("barangay");
  const selectedBarangay = useMemo(
    () => tagbilaranBarangays.find((barangay) => barangay.code === selectedCode),
    [selectedCode],
  );
  const activeLayer = hazardLayers.find((layer) => layer.id === activeHazard) ?? hazardLayers[0];
  const [legendOpacity, setLegendOpacity] = useState(72);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const suffix = next.toString();
      window.history.replaceState(null, "", suffix ? `${pathname}?${suffix}` : pathname);
    },
    [pathname, searchParams],
  );

  return (
    <div className="hazard-assessment">
      <header className="hazard-assessment__cover">
        <div>
          <p className="section-kicker">Preparedness field desk · Tagbilaran City</p>
          <h1>Hazard assessment</h1>
          <p>
            Inspect an area, choose a hazard, and continue to the official source. This
            journal does not calculate a combined risk score or declare a place safe.
          </p>
        </div>
        <aside aria-label="Important status">
          <span>Official layer status</span>
          <strong>Awaiting reusable Tagbilaran data</strong>
          <p>No substitute polygons, scraped tiles, or simulated heatmap are displayed.</p>
        </aside>
      </header>

      <div className="hazard-assessment__workspace">
        <form className="hazard-assessment__form" onSubmit={(event) => event.preventDefault()}>
          <div className="hazard-step">
            <span className="hazard-step__number" aria-hidden="true">01</span>
            <fieldset>
              <legend>Choose a hazard</legend>
              <p>Each official layer represents a different scenario. They are never merged into one score.</p>
              <div className="hazard-tabs">
                {hazardLayers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    aria-pressed={layer.id === activeHazard}
                    onClick={() => replaceParams({ hazard: layer.id })}
                  >
                    <span aria-hidden="true" data-hazard-icon={layer.id} />
                    {layer.label.replace(" susceptibility", "")}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="hazard-step">
            <span className="hazard-step__number" aria-hidden="true">02</span>
            <fieldset>
              <legend>Choose an area</legend>
              <p>Select a barangay here or directly on the city map. No device location is requested or stored.</p>
              <label className="hazard-area-select">
                <span>Assessment area</span>
                <select
                  value={selectedBarangay?.code ?? ""}
                  onChange={(event) => replaceParams({ barangay: event.target.value || null })}
                >
                  <option value="">Whole Tagbilaran City</option>
                  {tagbilaranBarangays.map((barangay) => (
                    <option value={barangay.code} key={barangay.code}>{barangay.name}</option>
                  ))}
                </select>
              </label>
            </fieldset>
          </div>

          <div className="hazard-step hazard-step--legend">
            <span className="hazard-step__number" aria-hidden="true">03</span>
            <fieldset>
              <legend>Read the official classification</legend>
              <p>Pattern and color will appear together when an approved layer is connected.</p>
              <div
                className="hazard-assessment__legend"
                aria-label="Classification style preview, not mapped data"
                style={{ "--legend-opacity": `${legendOpacity}%` } as CSSProperties}
              >
                {activeLayer.classifications.map((classification) => (
                  <span key={classification.level}>
                    <i data-level={classification.level} aria-hidden="true" />
                    <span><strong>{classification.label}</strong><small>{classification.description}</small></span>
                  </span>
                ))}
              </div>
              <label className="hazard-opacity">
                <span>Legend preview opacity: {legendOpacity}%</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={legendOpacity}
                  onChange={(event) => setLegendOpacity(Number(event.target.value))}
                />
              </label>
              <small className="hazard-preview-note">Style preview only · not a heatmap or local classification</small>
            </fieldset>
          </div>
        </form>

        <section className="hazard-map" aria-labelledby="hazard-map-title">
          <div className="hazard-map__heading">
            <div>
              <p className="section-kicker">Boundary inspection</p>
              <h2 id="hazard-map-title">{selectedBarangay?.name ?? "Tagbilaran City"}</h2>
            </div>
            <span>Indicative boundary</span>
          </div>
          <div className="hazard-map__canvas">
            <HazardMap
              places={noPlaces}
              highlightedIds={noPlaceIds}
              selectedBarangayCode={selectedBarangay?.code}
              onPreview={() => undefined}
              onActivate={() => undefined}
              onSelectBarangay={(code) => replaceParams({ barangay: code ?? null })}
            />
            <div className="hazard-map__unavailable" role="status">
              <span>Layer unavailable</span>
              <strong>{activeLayer.label}</strong>
              <p>{activeLayer.scenario}</p>
            </div>
          </div>
          <p className="hazard-map__caption">
            Barangay and city outlines support orientation only and still require local confirmation.
            They are not hazard geometry.
          </p>
        </section>

        <section className="hazard-result" aria-live="polite" aria-labelledby="hazard-result-title">
          <p className="section-kicker">Assessment note</p>
          <h2 id="hazard-result-title">No local classification issued</h2>
          <dl>
            <div><dt>Area</dt><dd>{selectedBarangay?.name ?? "Whole Tagbilaran City"}</dd></div>
            <div><dt>Hazard</dt><dd>{activeLayer.label}</dd></div>
            <div><dt>Source</dt><dd>{activeLayer.source}</dd></div>
            <div><dt>Status</dt><dd>Official geometry pending</dd></div>
          </dl>
          <p>{activeLayer.description}</p>
          <p>
            Susceptibility maps are not live warnings. Check current instructions from local authorities
            and PAGASA during an event.
          </p>
          <div className="hazard-result__actions">
            <a href={activeLayer.sourceUrl} target="_blank" rel="noreferrer">
              Continue to UP NOAH <span aria-hidden="true">↗</span>
            </a>
            <Link href="/explore">Open the city places map</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
