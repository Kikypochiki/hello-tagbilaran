import type { Metadata } from "next";
import { Suspense } from "react";
import { HazardAssessmentClient } from "@/components/hazards/hazard-assessment-client";
import { hazardLayers } from "@/content/hazards";

export const metadata: Metadata = {
  title: "Hazard assessment",
  description:
    "An interactive Tagbilaran hazard map using Project NOAH flood, landslide, and storm-surge scenario data.",
  alternates: { canonical: "/hazard-assessment" },
};

export default function HazardAssessmentPage() {
  return (
    <main id="main-content" className="hazard-assessment-page">
      <noscript>
        <section className="hazard-noscript">
          <h1>Tagbilaran hazard assessment</h1>
          <p>
            The interactive map requires JavaScript. Use the source links below
            to verify flood, landslide, and storm-surge scenarios with UP NOAH.
          </p>
          <ul>
            {hazardLayers.map((layer) => (
              <li key={layer.id}>
                <a href={layer.sourceUrl}>{layer.label} at UP NOAH</a>
              </li>
            ))}
          </ul>
        </section>
      </noscript>
      <Suspense
        fallback={
          <div className="workspace-loading" role="status">
            Opening the hazard map…
          </div>
        }
      >
        <HazardAssessmentClient />
      </Suspense>
    </main>
  );
}
