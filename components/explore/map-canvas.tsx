"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapLibreMap, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Place } from "@/types/content";

export function MapCanvas({
  places,
  selectedId,
  onSelect,
}: {
  places: Place[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || !places.length || !places[0].coordinates) return;

    const first = places[0].coordinates;
    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [first.longitude, first.latitude],
      zoom: 14,
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
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;
    const markers = markersRef.current;

    places.forEach((place) => {
      if (!place.coordinates) return;
      const markerButton = document.createElement("button");
      markerButton.type = "button";
      markerButton.className = "journal-marker";
      markerButton.setAttribute("aria-label", `Select ${place.name}`);
      markerButton.title = place.name;
      markerButton.addEventListener("click", () => onSelect(place.id));

      const marker = new maplibregl.Marker({ element: markerButton, anchor: "bottom" })
        .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
        .addTo(map);
      markers.set(place.id, marker);
    });

    return () => {
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [onSelect, places]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().toggleAttribute("data-selected", id === selectedId);
    });
    const selected = places.find((place) => place.id === selectedId);
    if (selected?.coordinates && mapRef.current) {
      mapRef.current.easeTo({
        center: [selected.coordinates.longitude, selected.coordinates.latitude],
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550,
      });
    }
  }, [places, selectedId]);

  return (
    <div
      className="map-canvas"
      ref={containerRef}
      role="region"
      aria-label="Interactive map of source-located prototype places. Use the list for full details."
    />
  );
}
