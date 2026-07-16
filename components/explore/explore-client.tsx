"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useCallback,
  useMemo,
  useState,
} from "react";
import { PlaceCard } from "@/components/place-card";
import { categoryLabels, categoryOrder } from "@/lib/place-labels";
import type { Place, PlaceCategory } from "@/types/content";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading" role="status">
        <span className="map-loading__compass" aria-hidden="true" />
        Preparing the optional map…
      </div>
    ),
  },
);

function isCategory(value: string | null): value is PlaceCategory {
  return Boolean(value && value in categoryLabels);
}

export function ExploreClient({ places }: { places: Place[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const category = isCategory(categoryParam) ? categoryParam : null;
  const selectedParam = searchParams.get("place") ?? undefined;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [showMap, setShowMap] = useState(true);

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return places.filter((place) => {
      const matchesCategory = !category || place.category === category;
      const matchesQuery =
        !normalized ||
        [place.name, place.summary, categoryLabels[place.category]]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, places, query]);

  const mappablePlaces = useMemo(
    () => filteredPlaces.filter((place) => Boolean(place.coordinates)),
    [filteredPlaces],
  );
  const selectedId = filteredPlaces.some((place) => place.id === selectedParam)
    ? selectedParam
    : undefined;

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  const selectPlace = useCallback(
    (id: string) => {
      replaceParams({ place: id });
      document.getElementById(`place-${id}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    },
    [replaceParams],
  );

  function updateQuery(value: string) {
    setQuery(value);
    replaceParams({ q: value.trim() || null, place: null });
  }

  return (
    <div className="explore-workspace">
      <section className="filter-sheet" aria-labelledby="filter-title">
        <div>
          <p className="section-kicker">Field index</p>
          <h2 id="filter-title">Find a place</h2>
        </div>
        <label className="search-field">
          <span>Search prototype listings</span>
          <span className="search-field__control">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Name, story, or category"
            />
          </span>
        </label>
        <fieldset className="category-filters">
          <legend>Filter by category</legend>
          <button
            type="button"
            aria-pressed={!category}
            onClick={() => replaceParams({ category: null, place: null })}
          >
            All places
          </button>
          {categoryOrder.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => replaceParams({ category: item, place: null })}
            >
              {categoryLabels[item]}
            </button>
          ))}
        </fieldset>
        <div className="view-switch" aria-label="Map visibility">
          <button type="button" aria-pressed={showMap} onClick={() => setShowMap(true)}>
            Map & list
          </button>
          <button type="button" aria-pressed={!showMap} onClick={() => setShowMap(false)}>
            View as list
          </button>
        </div>
      </section>

      {showMap ? (
        <section className="map-sheet" aria-labelledby="map-title">
          <div className="map-sheet__heading">
            <div>
              <p className="section-kicker">Progressive enhancement</p>
              <h2 id="map-title">Source-located stops</h2>
            </div>
            <span>
              {mappablePlaces.length} of {filteredPlaces.length} on map
            </span>
          </div>
          {mappablePlaces.length ? (
            <MapCanvas
              places={mappablePlaces}
              selectedId={selectedId}
              onSelect={selectPlace}
            />
          ) : (
            <div className="map-empty">
              <span aria-hidden="true">⌖</span>
              <h3>No source-backed map points in this view</h3>
              <p>
                Listings stay in the field index until their coordinates are locally
                verified. The complete filtered list is below.
              </p>
            </div>
          )}
          <p className="map-disclosure">
            Prototype map points show only source-recorded coordinates. Confirm locations
            before travel.
          </p>
        </section>
      ) : null}

      <section className="results-sheet" aria-labelledby="results-title">
        <header className="results-sheet__header">
          <div>
            <p className="section-kicker">Synchronized field index</p>
            <h2 id="results-title">
              {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"}
            </h2>
          </div>
          <p className="results-count" aria-live="polite">
            Showing {filteredPlaces.length} of {places.length} prototype listings
          </p>
        </header>
        {filteredPlaces.length ? (
          <div className="place-grid">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                selected={place.id === selectedId}
                onSelectId={place.id === selectedId ? "map-title" : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="results-empty">
            <span className="results-empty__stamp" aria-hidden="true">
              NO MATCH
            </span>
            <h3>No place notes match this search—yet.</h3>
            <p>
              Try a broader phrase or return to all categories. Prototype listings may be
              renamed as local verification continues.
            </p>
            <button
              className="secondary-action"
              type="button"
              onClick={() => {
                setQuery("");
                replaceParams({ q: null, category: null, place: null });
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
