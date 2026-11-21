// Activity uses observed completions on this site, once per task per local day.
export type CompletionEvent = { id: number; task_id: string | null; tweek_id: string | null; at: string };
export type ActivityDay = { date: string; count: number };
export type CompletionStats = {
  days: ActivityDay[];
  calendar: ActivityDay[];
  recent: number;
  weekdays: number[];
  comparison: { current: number; previous: number; difference: number };
  records: { day: ActivityDay | null; week: ActivityDay | null };
  continuity: { activeDays: number; currentStreak: number; longestStreak: number };
  periods: { label: string; hours: string; count: number }[];
  firstActivityDate: string | null;
};

// ISO calendar dates are shifted in UTC so DST cannot add or skip a day.
const shiftDate = (date: string, offset: number) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
};
const weekday = (date: string) => (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
const monday = (date: string) => shiftDate(date, -weekday(date));

export function completionStats(events: CompletionEvent[], now: Date, timeZone: string): CompletionStats {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
  });
  const localTime = (date: Date) => {
    const parts = formatter.formatToParts(date);
    const part = (name: string) => parts.find((p) => p.type === name)!.value;
    return { date: `${part("year")}-${part("month")}-${part("day")}`, hour: Number(part("hour")) };
  };
  const today = localTime(now).date;
  const calendarStart = shiftDate(today, -90);
  const counts = new Map<string, number>();
  const seen = new Set<string>();
  const periods = [
    { label: "Night", hours: "00–06", count: 0 },
    { label: "Morning", hours: "06–12", count: 0 },
    { label: "Afternoon", hours: "12–18", count: 0 },
    { label: "Evening", hours: "18–24", count: 0 },
  ];
  // Keep the first completion time if a task is reopened/completed on the same day.
  const ordered = events.map((event) => ({ event, at: new Date(event.at) }))
    .filter(({ at }) => Number.isFinite(at.getTime()) && at <= now)
    .sort((a, b) => a.at.getTime() - b.at.getTime() || a.event.id - b.event.id);
  for (const { event, at } of ordered) {
    const { date, hour } = localTime(at);
    const key = `${date}:${event.task_id ?? event.tweek_id ?? `event-${event.id}`}`;
    if (seen.has(key)) continue;
    seen.add(key);
    counts.set(date, (counts.get(date) ?? 0) + 1);
    if (date >= calendarStart) periods[Math.floor(hour / 6)].count++;
  }
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = shiftDate(calendarStart, i);
    return { date, count: counts.get(date) ?? 0 };
  });
  const weeks = new Map<string, number>();
  const weekdays = Array<number>(7).fill(0);
  let bestDay: ActivityDay | null = null;
  let bestWeek: ActivityDay | null = null;
  let longestStreak = 0, streak = 0;
  let previous: string | null = null;
  for (const [date, count] of counts) {
    if (!bestDay || count > bestDay.count) bestDay = { date, count };
    const week = monday(date);
    weeks.set(week, (weeks.get(week) ?? 0) + count);
    streak = previous && shiftDate(previous, 1) === date ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
    previous = date;
  }
  for (const [date, count] of weeks) {
    if (!bestWeek || count > bestWeek.count) bestWeek = { date, count };
  }
  for (const day of days.slice(-28)) weekdays[weekday(day.date)] += day.count;
  const start = monday(today);
  let current = 0, lastWeek = 0;
  for (let i = 0; i <= weekday(today); i++) {
    current += counts.get(shiftDate(start, i)) ?? 0;
    lastWeek += counts.get(shiftDate(start, i - 7)) ?? 0;
  }
  let currentStreak = 0;
  // An unfinished today does not break yesterday's streak.
  for (let date = counts.has(today) ? today : shiftDate(today, -1); counts.has(date); date = shiftDate(date, -1)) currentStreak++;
  return {
    days: days.slice(-28), calendar: days, recent: days.slice(-28).reduce((sum, day) => sum + day.count, 0), weekdays,
    comparison: { current, previous: lastWeek, difference: current - lastWeek },
    records: { day: bestDay, week: bestWeek },
    continuity: { activeDays: days.slice(-7).filter((day) => day.count > 0).length, currentStreak, longestStreak },
    periods, firstActivityDate: counts.keys().next().value ?? null,
  };
}
