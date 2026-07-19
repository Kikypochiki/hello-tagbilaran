import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreClient } from "@/components/explore/explore-client";
import { places } from "@/content/places";

export const metadata: Metadata = {
  title: "Explore the city map",
  description:
    "Explore Tagbilaran through an interactive city map, collapsible place index, and indicative barangay boundaries.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <main id="main-content" className="explore-page explore-page--map-only">
      <noscript>
        <div className="no-script-note no-script-note--map">
          The interactive map requires JavaScript. Open the map index to use the standalone
          place links without the map.
        </div>
      </noscript>
      <Suspense fallback={<ExploreWorkspaceLoading />}>
        <ExploreClient places={places} />
      </Suspense>
    </main>
  );
}

function ExploreWorkspaceLoading() {
  return (
    <div className="workspace-loading workspace-loading--map" role="status">
      <span aria-hidden="true" />
      Opening the city field map…
    </div>
  );
}
