import { scopeLabels } from "@/lib/place-labels";
import type { GeographicScope } from "@/types/content";

export function ScopeBadge({ scope }: { scope: GeographicScope }) {
  return (
    <span className="scope-badge" data-scope={scope}>
      {scopeLabels[scope]}
    </span>
  );
}
