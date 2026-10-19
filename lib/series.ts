import { admin } from "@/lib/supabase-admin";
import { createLocalAndRemote, deleteLocalAndRemote, effectiveColor, updateLocalAndRemote } from "@/lib/tasks-store";

// Ricorrenze gestite da noi: Tweek free rifiuta freq/recurrence via API, quindi ogni serie
// genera task normali in Tweek per le prossime settimane (la finestra avanza a ogni sync).

export const FREQS = ["daily", "weekdays", "weekly", "biweekly", "monthly", "yearly"] as const;
export type Freq = (typeof FREQS)[number];
export const isFreq = (v: unknown): v is Freq => FREQS.includes(v as Freq);

const HORIZON_DAYS = 28;
const DAY = 86400000;

const toDate = (s: string) => new Date(s + "T00:00:00Z");
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => fmt(new Date(toDate(s).getTime() + n * DAY));
const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
export const todayRome = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());

function matches(freq: Freq, start: string, day: string) {
  const s = toDate(start), d = toDate(day);
  const diff = Math.round((d.getTime() - s.getTime()) / DAY);
  if (diff < 0) return false;
  // il 31 diventa l'ultimo giorno nei mesi più corti, il 29 febbraio il 28 negli anni non bisestili
  const sameDay = () => d.getUTCDate() === Math.min(s.getUTCDate(), daysInMonth(d.getUTCFullYear(), d.getUTCMonth()));
  switch (freq) {
    case "daily": return true;
    case "weekdays": return d.getUTCDay() >= 1 && d.getUTCDay() <= 5;
    case "weekly": return diff % 7 === 0;
    case "biweekly": return diff % 14 === 0;
    case "monthly": return sameDay();
    case "yearly": return d.getUTCMonth() === s.getUTCMonth() && sameDay();
  }
}

type Series = {
  id: string; calendar_id: string; text: string; note: string | null; color: string | null;
  freq: Freq; dt_start: string; last_generated: string | null;
};

// Crea le occorrenze mancanti fino a oggi + HORIZON_DAYS. Mai nel passato.
export async function extendSeries(onlyId?: string) {
  const db = admin();
  let q = db.from("tw_series").select("*").is("deleted_at", null);
  if (onlyId) q = q.eq("id", onlyId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const today = todayRome();
  const to = addDays(today, HORIZON_DAYS);
  let created = 0;
  for (const s of (data ?? []) as Series[]) {
    let day = s.last_generated ? addDays(s.last_generated, 1) : s.dt_start;
    if (day < today) day = today;
    for (; day <= to; day = addDays(day, 1)) {
      if (!matches(s.freq, s.dt_start, day)) continue;
      await createLocalAndRemote({
        text: s.text, date: day, note: s.note, color: s.color, seriesId: s.id, calendarId: s.calendar_id,
      });
      created++;
      await db.from("tw_series").update({ last_generated: day }).eq("id", s.id);
    }
    if (!s.last_generated || s.last_generated < to) {
      await db.from("tw_series").update({ last_generated: to }).eq("id", s.id);
    }
  }
  return created;
}

const futureOccurrences = async (seriesId: string, after: string) => {
  const { data, error } = await admin()
    .from("tw_tasks").select("id").is("deleted_at", null).eq("done", false)
    .eq("local->>series_id", seriesId).gt("date", after);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.id as string);
};

// Ferma la serie: cancella le occorrenze future non completate, quelle passate restano.
async function stopSeries(seriesId: string, after: string) {
  for (const id of await futureOccurrences(seriesId, after)) await deleteLocalAndRemote(id);
  await admin().from("tw_series").update({ deleted_at: new Date().toISOString() }).eq("id", seriesId);
}

// freq = null smette di ripetere; un'altra freq riparte da questo task.
export async function setRepeat(taskId: string, freq: Freq | null) {
  const db = admin();
  const { data: t, error } = await db.from("tw_tasks").select("*").eq("id", taskId).single();
  if (error || !t) throw new Error("Task not found");
  if (freq && !t.date) throw new Error("Only tasks with a date can repeat");

  const local = { ...(t.local ?? {}) };
  if (local.series_id) await stopSeries(local.series_id, t.date ?? "0000-00-00");
  delete local.series_id;

  if (freq) {
    const { data: s, error: e2 } = await db.from("tw_series").insert({
      calendar_id: t.calendar_id, text: t.text, note: t.note, color: effectiveColor(t),
      freq, dt_start: t.date, last_generated: t.date,
    }).select("id").single();
    if (e2) throw new Error(e2.message);
    local.series_id = s.id;
  }
  await db.from("tw_tasks").update({ local, updated_at: new Date().toISOString() }).eq("id", taskId);
  if (local.series_id) await extendSeries(local.series_id);
}

// Testo, note e colore modificati su un'occorrenza valgono anche per le prossime.
export async function propagate(taskId: string, p: { text?: string; note?: string | null; color?: string | null }) {
  const fields = Object.fromEntries(Object.entries(p).filter(([k]) => ["text", "note", "color"].includes(k)));
  if (!Object.keys(fields).length) return;
  const db = admin();
  const { data: t } = await db.from("tw_tasks").select("date,local").eq("id", taskId).single();
  const seriesId = t?.local?.series_id;
  if (!seriesId || !t.date) return;
  const { data: s } = await db.from("tw_series").select("id").eq("id", seriesId).is("deleted_at", null).maybeSingle();
  if (!s) return;

  await db.from("tw_series").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", seriesId);
  for (const id of await futureOccurrences(seriesId, t.date)) await updateLocalAndRemote(id, fields);
}

export async function activeSeries() {
  const { data, error } = await admin().from("tw_series").select("id,freq").is("deleted_at", null);
  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((s) => [s.id as string, s.freq as Freq]));
}
