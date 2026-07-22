import Link from "next/link";
import { categoryCountsForBarangay, placesForBarangay } from "@/lib/barangays";
import { categoryLabels } from "@/lib/place-labels";
import type { TagbilaranBarangay } from "@/content/barangays";
import type { Place, PlaceCategory } from "@/types/content";

export function BarangaySheet({ barangay, places, previous, next, onChoose, onClose }: {
  barangay: TagbilaranBarangay;
  places: Place[];
  previous: TagbilaranBarangay;
  next: TagbilaranBarangay;
  onChoose: (code: string) => void;
  onClose: () => void;
}) {
  const localPlaces = placesForBarangay(places, barangay);
  const counts = categoryCountsForBarangay(places, barangay);
  return (
    <aside className="barangay-sheet" aria-labelledby="selected-barangay-title">
      <button className="barangay-sheet__close" type="button" onClick={onClose} aria-label="Close barangay sheet">×</button>
      <p className="section-kicker">Barangay field sheet · PSGC {barangay.code}</p>
      <h2 id="selected-barangay-title">{barangay.name}</h2>
      <p>{barangay.summary}</p>
      <div className="barangay-sheet__counts" aria-label="Place categories in this guide">
        {Object.entries(counts).map(([category, count]) => (
          <span key={category}>{categoryLabels[category as PlaceCategory]} <strong>{count}</strong></span>
        ))}
      </div>
      {localPlaces.length ? (
        <ol>{localPlaces.slice(0, 5).map((place) => <li key={place.id}><Link href={`/places/${place.slug}`}>{place.name}</Link></li>)}</ol>
      ) : <p className="barangay-sheet__empty">No source-reviewed place entry is assigned here yet.</p>}
      <a className="barangay-sheet__official" href={barangay.officialDirectoryUrl} target="_blank" rel="noreferrer">Open the official city directory <span aria-hidden="true">↗</span></a>
      <nav aria-label="Adjacent barangays">
        <button type="button" onClick={() => onChoose(previous.code)}>← {previous.name}</button>
        <button type="button" onClick={() => onChoose(next.code)}>{next.name} →</button>
      </nav>
    </aside>
  );
}
