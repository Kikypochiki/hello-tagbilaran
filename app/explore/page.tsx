import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreClient } from "@/components/explore/explore-client";
import { places } from "@/content/places";

export const metadata: Metadata = {
  title: "Explore the city",
  description:
    "Browse prototype Tagbilaran City place notes by category, geographic scope, list, or enhanced map.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <main id="main-content" className="explore-page">
      <header className="explore-hero">
        <div>
          <p className="kicker">The story continues in the streets</p>
          <h1>Explore Tagbilaran</h1>
        </div>
        <p>
          A source-conscious prototype field guide. Every card states its geographic scope;
          details marked for local verification should not yet be used for travel planning.
        </p>
      </header>
      <noscript>
        <div className="no-script-note">
          JavaScript is off. The complete place list remains available below; interactive
          filtering, saving, and the optional map require JavaScript.
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
    <div className="workspace-loading" role="status">
      <span aria-hidden="true" />
      Opening the field index…
    </div>
  );
}
