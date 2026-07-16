"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useMemo, useState } from "react";
import { PlaceCard } from "@/components/place-card";
import { ScopeBadge } from "@/components/scope-badge";
import { categoryLabels, categoryOrder } from "@/lib/place-labels";
import type { Place, PlaceCategory } from "@/types/content";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading map-loading--full" role="status">
        <span className="map-loading__compass" aria-hidden="true" />
        Opening the illustrated city map…
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
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [showMap, setShowMap] = useState(true);
  const [previewedId, setPreviewedId] = useState<string>();

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
    () => places.filter((place) => Boolean(place.coordinates)),
    [places],
  );
  const highlightedIds = useMemo(
    () => filteredPlaces.filter((place) => place.coordinates).map((place) => place.id),
    [filteredPlaces],
  );
  const previewedPlace = mappablePlaces.find((place) => place.id === previewedId);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      startTransition(() => {
        const suffix = next.toString();
        router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const activatePlace = useCallback(
    (slug: string) => router.push(`/places/${slug}`),
    [router],
  );

  function updateQuery(value: string) {
    setQuery(value);
    setPreviewedId(undefined);
    replaceParams({ q: value.trim() || null, place: null });
  }

  function openList() {
    setShowMap(false);
    window.requestAnimationFrame(() => {
      document.getElementById("results-title")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="explore-workspace" data-map-visible={showMap || undefined}>
      <section className="filter-sheet" aria-labelledby="filter-title">
        <div className="filter-sheet__heading">
          <div>
            <p className="section-kicker">Map index</p>
            <h2 id="filter-title">Find a place</h2>
          </div>
          <span aria-live="polite">
            {highlightedIds.length} mapped · {filteredPlaces.length} listed
          </span>
        </div>
        <label className="search-field">
          <span>Search place notes</span>
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
        <fieldset className="category-filters category-filters--map">
          <legend>Highlight a category on the map</legend>
          <button
            type="button"
            aria-pressed={!category}
            onClick={() => {
              setPreviewedId(undefined);
              replaceParams({ category: null, place: null });
            }}
          >
            All
          </button>
          {categoryOrder.map((item) => {
            const locatedCount = places.filter(
              (place) => place.category === item && place.coordinates,
            ).length;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setPreviewedId(undefined);
                  replaceParams({ category: item, place: null });
                }}
              >
                {categoryLabels[item]}
                <small>{locatedCount ? `${locatedCount} mapped` : "list only"}</small>
              </button>
            );
          })}
        </fieldset>
        <div className="view-switch" aria-label="Explore view">
          {!showMap ? (
            <button type="button" onClick={() => setShowMap(true)}>
              Return to map
            </button>
          ) : (
            <button type="button" onClick={openList}>
              View accessible list
            </button>
          )}
        </div>
      </section>

      {showMap ? (
        <section className="map-sheet" aria-labelledby="map-title">
          <div className="map-sheet__heading">
            <div>
              <p className="section-kicker">Source-located field map</p>
              <h2 id="map-title">
                {category ? categoryLabels[category] : "Tagbilaran on the page"}
              </h2>
            </div>
            <span>Hover or focus a marker · click for the full entry</span>
          </div>
          <MapCanvas
            places={mappablePlaces}
            highlightedIds={highlightedIds}
            previewedId={previewedId}
            onPreview={setPreviewedId}
            onActivate={activatePlace}
          />
          {highlightedIds.length === 0 ? (
            <div className="map-category-empty" role="status">
              <strong>No source-backed points in this filter.</strong>
              <span>The matching place notes remain in the list below.</span>
            </div>
          ) : null}
          {previewedPlace ? (
            <aside className="map-place-preview" aria-live="polite">
              <div className="map-place-preview__labels">
                <ScopeBadge scope={previewedPlace.scope} />
                <span className="category-label">
                  {categoryLabels[previewedPlace.category]}
                </span>
              </div>
              <p className="section-kicker">Place note</p>
              <h3 id="map-preview-title">{previewedPlace.name}</h3>
              <p>{previewedPlace.summary}</p>
              <Link className="text-link" href={`/places/${previewedPlace.slug}`}>
                Open the full place entry <span aria-hidden="true">→</span>
              </Link>
            </aside>
          ) : (
            <div className="map-hover-hint" aria-hidden="true">
              <span>01</span>
              Hover a map pin to open its field note
            </div>
          )}
          <p className="map-disclosure">
            Prototype map points use recorded coordinates and still require a local launch
            check. Complete content is available in the list.
          </p>
        </section>
      ) : null}

      <section className="results-sheet" aria-labelledby="results-title">
        <header className="results-sheet__header">
          <div>
            <p className="section-kicker">Accessible field index</p>
            <h2 id="results-title">
              {filteredPlaces.length} {filteredPlaces.length === 1 ? "place note" : "place notes"}
            </h2>
          </div>
          <p className="results-count" aria-live="polite">
            Showing {filteredPlaces.length} of {places.length} prototype listings
          </p>
        </header>
        {filteredPlaces.length ? (
          <div className="place-grid">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
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
