// Each task counts once per local calendar day, even if toggled repeatedly.
export type CompletionEvent = { id: number; task_id: string | null; tweek_id: string | null; at: string };
export type ActivityDay = { date: string; count: number };

export function completionActivity(events: CompletionEvent[], now: Date, timeZone: string): ActivityDay[] {
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const dateKey = (date: Date) => {
    const parts = formatter.formatToParts(date);
    const part = (name: string) => parts.find((p) => p.type === name)!.value;
    return `${part("year")}-${part("month")}-${part("day")}`;
  };
  const [year, month, day] = dateKey(now).split("-").map(Number);
  const days = Array.from({ length: 28 }, (_, i) => ({
    date: new Date(Date.UTC(year, month - 1, day - 27 + i)).toISOString().slice(0, 10), count: 0,
  }));
  const buckets = new Map(days.map((day) => [day.date, day]));
  const seen = new Set<string>();
  for (const event of events) {
    const at = new Date(event.at);
    if (!Number.isFinite(at.getTime()) || at > now) continue;
    const date = dateKey(at);
    const bucket = buckets.get(date);
    const key = `${date}:${event.task_id ?? event.tweek_id ?? `event-${event.id}`}`;
    if (!bucket || seen.has(key)) continue;
    seen.add(key);
    bucket.count++;
  }
  return days;
}
