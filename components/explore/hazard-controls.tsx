import { hazardLayers } from "@/content/hazards";
import type { HazardKind } from "@/types/hazards";

export function HazardControls({ activeHazard, onSelect }: {
  activeHazard: HazardKind;
  onSelect: (hazard: HazardKind) => void;
}) {
  const layer = hazardLayers.find((item) => item.id === activeHazard) ?? hazardLayers[0];
  return (
    <aside className="hazard-sheet" aria-labelledby="hazard-sheet-title">
      <p className="section-kicker">Preparedness overlay</p>
      <h2 id="hazard-sheet-title">Tagbilaran hazard awareness</h2>
      <div className="hazard-sheet__tabs" role="group" aria-label="Choose a hazard layer">
        {hazardLayers.map((item) => (
          <button key={item.id} type="button" aria-pressed={item.id === activeHazard} onClick={() => onSelect(item.id)}>
            {item.label.replace(" susceptibility", "")}
          </button>
        ))}
      </div>
      <div className="hazard-sheet__status" role="status">
        <span>Data pending</span>
        <h3>{layer.label}</h3>
        <p>{layer.description}</p>
        <p>The layer remains hidden until UP NOAH reuse terms, scenario details, and Tagbilaran coverage are verified. No substitute geometry is shown.</p>
      </div>
      <div className="hazard-legend" aria-label="Hazard classification legend">
        <span><i data-level="low" />Low</span><span><i data-level="medium" />Medium</span><span><i data-level="high" />High</span>
      </div>
      <p className="hazard-sheet__disclaimer">Susceptibility maps are not live warnings and cannot determine whether a property is safe. Follow current instructions from local authorities and PAGASA.</p>
      <a href={layer.sourceUrl} target="_blank" rel="noreferrer">Verify with UP NOAH <span aria-hidden="true">↗</span></a>
    </aside>
  );
}
