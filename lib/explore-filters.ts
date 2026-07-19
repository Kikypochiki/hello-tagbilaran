import { categoryLabels } from "@/lib/place-labels";
import type { Place, PlaceCategory } from "@/types/content";

export interface ExploreFilterState {
  category: PlaceCategory | null;
  query: string;
  savedOnly: boolean;
  savedIds: ReadonlySet<string>;
}

export function filterPlaces(places: Place[], state: ExploreFilterState) {
  const normalized = state.query.trim().toLocaleLowerCase();

  return places.filter((place) => {
    if (state.category && place.category !== state.category) return false;
    if (state.savedOnly && !state.savedIds.has(place.id)) return false;
    if (!normalized) return true;

    return [place.name, place.summary, categoryLabels[place.category], place.barangay]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalized);
  });
}
