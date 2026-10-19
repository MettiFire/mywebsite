import { effectiveChecklist, effectiveColor, type StoredRow } from "@/lib/tasks-store";
import type { Freq } from "@/lib/series";

// Riga del DB → task per il client: applica gli override locali e la ricorrenza attiva.
export function toView(r: StoredRow & Record<string, unknown>, series: Map<string, Freq>) {
  const { local, ...rest } = r;
  const sid = local?.series_id;
  return { ...rest, color: effectiveColor(r), checklist: effectiveChecklist(r), sort: local?.sort ?? null, repeat: (sid && series.get(sid)) || null };
}
