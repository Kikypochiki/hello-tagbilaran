"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  LngLatBounds,
  type Map as MapLibreMap,
  type Marker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Place } from "@/types/content";

export function MapCanvas({
  places,
  highlightedIds,
  previewedId,
  onPreview,
  onActivate,
}: {
  places: Place[];
  highlightedIds: string[];
  previewedId?: string;
  onPreview: (id?: string) => void;
  onActivate: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onPreviewRef = useRef(onPreview);
  const onActivateRef = useRef(onActivate);

  useEffect(() => {
    onPreviewRef.current = onPreview;
    onActivateRef.current = onActivate;
  }, [onActivate, onPreview]);

  useEffect(() => {
    if (!containerRef.current || !places.length || !places[0].coordinates) return;

    const first = places[0].coordinates;
    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [first.longitude, first.latitude],
      zoom: 13.7,
      cooperativeGestures: true,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            paint: { "raster-saturation": -0.48, "raster-contrast": 0.05 },
          },
        ],
      },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;
    const markers = markersRef.current;

    places.forEach((place, index) => {
      if (!place.coordinates) return;
      const markerButton = document.createElement("button");
      markerButton.type = "button";
      markerButton.className = "journal-marker";
      markerButton.dataset.placeId = place.id;
      markerButton.dataset.markerNumber = String(index + 1).padStart(2, "0");
      markerButton.setAttribute("aria-label", `Open the full place entry for ${place.name}`);
      markerButton.addEventListener("pointerenter", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("pointerleave", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("focus", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("blur", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("click", () => onActivateRef.current(place.slug));

      const marker = new maplibregl.Marker({ element: markerButton, anchor: "bottom" })
        .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
        .addTo(map);
      markers.set(place.id, marker);
    });

    const fitAllPlaces = () => {
      const bounds = new LngLatBounds();
      places.forEach((place) => {
        if (place.coordinates) {
          bounds.extend([place.coordinates.longitude, place.coordinates.latitude]);
        }
      });
      if (!bounds.isEmpty()) {
        const compact = window.innerWidth <= 780;
        map.fitBounds(bounds, {
          padding: compact
            ? { top: 210, right: 55, bottom: 330, left: 55 }
            : { top: 170, right: 120, bottom: 130, left: 390 },
          maxZoom: 14.4,
          duration: 0,
        });
      }
    };
    map.once("load", fitAllPlaces);

    return () => {
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [places]);

  useEffect(() => {
    const highlighted = new Set(highlightedIds);
    markersRef.current.forEach((marker, id) => {
      const element = marker.getElement();
      element.toggleAttribute("data-highlighted", highlighted.has(id));
      element.toggleAttribute("data-muted", !highlighted.has(id));
      element.toggleAttribute("data-previewed", id === previewedId);
    });
  }, [highlightedIds, previewedId]);

  useEffect(() => {
    const highlighted = new Set(highlightedIds);
    const map = mapRef.current;
    const located = places.filter(
      (place) => place.coordinates && highlighted.has(place.id),
    );
    if (!map || !located.length) return;

    const moveToHighlights = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = window.innerWidth <= 780;
      if (located.length === 1 && located[0].coordinates) {
        map.easeTo({
          center: [located[0].coordinates.longitude, located[0].coordinates.latitude],
          zoom: 15,
          duration: reducedMotion ? 0 : 650,
        });
        return;
      }

      const bounds = new LngLatBounds();
      located.forEach((place) => {
        if (place.coordinates) {
          bounds.extend([place.coordinates.longitude, place.coordinates.latitude]);
        }
      });
      map.fitBounds(bounds, {
        padding: compact
          ? { top: 210, right: 55, bottom: 330, left: 55 }
          : { top: 170, right: 120, bottom: 130, left: 390 },
        maxZoom: 14.4,
        duration: reducedMotion ? 0 : 650,
      });
    };

    if (map.loaded()) moveToHighlights();
    else map.once("load", moveToHighlights);

    return () => {
      map.off("load", moveToHighlights);
    };
  }, [highlightedIds, places]);

  return (
    <div
      className="map-canvas"
      ref={containerRef}
      role="region"
      aria-label="Interactive map of source-located prototype places. Hover or focus a marker for a short note; activate it for the full place entry."
    />
  );
}
