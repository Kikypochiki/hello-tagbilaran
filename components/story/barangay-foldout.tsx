import Link from "next/link";
import { tagbilaranBarangays } from "@/content/barangays";
import { places } from "@/content/places";
import { placesForBarangay } from "@/lib/barangays";

export function BarangayFoldout() {
  return (
    <section className="barangay-foldout" aria-labelledby="barangay-foldout-title">
      <header>
        <p className="section-kicker">Field index · 15 barangays</p>
        <h2 id="barangay-foldout-title">Meet the city, neighborhood by neighborhood.</h2>
        <p>Open a tab to highlight its boundary and the places already catalogued there.</p>
      </header>
      <ol>
        {tagbilaranBarangays.map((barangay, index) => {
          const count = placesForBarangay(places, barangay).length;
          return (
            <li key={barangay.code} style={{ "--tab-index": index } as React.CSSProperties}>
              <Link href={`/explore?barangay=${barangay.code}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{barangay.name}</strong>
                <small>{count ? `${count} guide ${count === 1 ? "place" : "places"}` : "Boundary index"}</small>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
