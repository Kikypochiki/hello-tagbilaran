import type { Metadata } from "next";
import { Suspense } from "react";
import { HazardAssessmentClient } from "@/components/hazards/hazard-assessment-client";
import { hazardLayers } from "@/content/hazards";

export const metadata: Metadata = {
  title: "Hazard assessment",
  description:
    "A source-conscious Tagbilaran hazard-assessment workspace with barangay inspection and official UP NOAH verification links.",
  alternates: { canonical: "/hazard-assessment" },
};

export default function HazardAssessmentPage() {
  return (
    <main id="main-content" className="hazard-assessment-page">
      <noscript>
        <section className="hazard-noscript">
          <h1>Tagbilaran hazard assessment</h1>
          <p>
            Interactive area selection requires JavaScript. No local hazard geometry is published while
            reuse terms and coverage remain unverified.
          </p>
          <ul>
            {hazardLayers.map((layer) => (
              <li key={layer.id}><a href={layer.sourceUrl}>{layer.label} at UP NOAH</a></li>
            ))}
          </ul>
        </section>
      </noscript>
      <Suspense fallback={<div className="workspace-loading" role="status">Opening the preparedness field desk…</div>}>
        <HazardAssessmentClient />
      </Suspense>
    </main>
  );
}
