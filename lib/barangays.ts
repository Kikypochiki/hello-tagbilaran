import type { Place } from "@/types/content";
import type { TagbilaranBarangay } from "@/content/barangays";

function comparable(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function placesForBarangay(places: Place[], barangay: TagbilaranBarangay) {
  const target = comparable(barangay.name);
  return places.filter(
    (place) => place.scope === "tagbilaran" && place.barangay && comparable(place.barangay) === target,
  );
}

export function categoryCountsForBarangay(places: Place[], barangay: TagbilaranBarangay) {
  return placesForBarangay(places, barangay).reduce<Record<string, number>>((counts, place) => {
    counts[place.category] = (counts[place.category] ?? 0) + 1;
    return counts;
  }, {});
}
