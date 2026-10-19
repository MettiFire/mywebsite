import { createHash } from "node:crypto";
import { admin } from "@/lib/supabase-admin";
import {
  getCalendars, getCustomColors, getTask, listTasks, TweekError, type TweekTask,
} from "@/lib/tweek";

const TZ = "Europe/Rome";
const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

// ---------- normalizzazione ----------

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, x]) => [k, sortKeys(x)])
    );
  }
  return v;
}
const stable = (v: unknown) => JSON.stringify(sortKeys(v ?? null));

export function toRow(t: TweekTask, fallbackCalendarId = "") {
  const row = {
    tweek_id: t.id,
    calendar_id: t.calendarId ?? fallbackCalendarId,
    text: t.text ?? "",
    done: !!t.done,
    date: t.date ?? null,
    list_id: t.listId ?? null,
    color: !t.color || t.color === "blank" ? null : t.color,
    note: t.note || null,
    checklist: t.checklist && t.checklist.length ? t.checklist : null,
    freq: t.freq || null,
    recurrence: t.recurrence || null,
    dt_start: t.dtStart ?? null,
    iso_date: t.isoDate ?? null,
    recurring_todo_id: t.recurringTodoId ?? null,
    is_virtual: !!t.virtual,
  };
  return { ...row, hash: createHash("sha1").update(stable(row)).digest("hex") };
}
export type Row = ReturnType<typeof toRow>;

export function diff(old: Record<string, unknown>, next: Row) {
  const ch: Record<string, [unknown, unknown]> = {};
  for (const k of Object.keys(next)) {
    if (k === "hash") continue;
    const a = old[k] ?? null;
    const b = (next as Record<string, unknown>)[k] ?? null;
    if (stable(a) !== stable(b)) ch[k] = [a, b];
  }
  return ch;
}

export function eventType(ch: Record<string, [unknown, unknown]>) {
  if ("done" in ch) return ch.done[1] ? "completed" : "reopened";
  if ("date" in ch || "list_id" in ch || "sort" in ch) return "moved";
  return "updated";
}

export const snapshot = (r: { text?: string; date?: string | null; done?: boolean }) => ({
  text: r.text, date: r.date ?? null, done: !!r.done,
});

// ---------- stato ----------

export async function getState<T = unknown>(key: string): Promise<T | null> {
  const { data } = await admin().from("tw_sync_state").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? null;
}
export async function setState(key: string, value: unknown) {
  await admin().from("tw_sync_state").upsert({ key, value, updated_at: new Date().toISOString() });
}

export type Target = {
  calendarId: string; listId: string | null; lists?: { id: string; name: string }[];
};

export async function defaultTarget(): Promise<Target> {
  const cached = await getState<Target>("default_target");
  if (cached?.lists) return cached; // i target salvati prima delle liste vanno rinfrescati
  return refreshTarget(await getCalendars());
}
async function refreshTarget(cals: Awaited<ReturnType<typeof getCalendars>>) {
  const c = cals.find((x) => x.isDefault) ?? cals[0];
  const lists = (c.lists ?? []).map((l) => ({ id: l.id, name: l.name ?? "" }));
  const t: Target = { calendarId: c.id, listId: lists[0]?.id ?? null, lists };
  await setState("default_target", t);
  return t;
}

// Colori personalizzati creati nell'app Tweek: servono solo per mostrarne la tinta giusta.
const BUILTIN = new Set(["blank", "pink", "yellowish", "cornflower", "mango", "greenish", "lilac", "grey", "black", "white"]);
async function syncTweekColors() {
  try {
    const seen = new Map<string, { id: string; bg: string; fg: string }>();
    for (const c of await getCustomColors()) {
      if (!BUILTIN.has(c.id) && !seen.has(c.id)) seen.set(c.id, { id: c.id, bg: c.backgroundColor, fg: c.color });
    }
    await setState("tweek_colors", [...seen.values()]);
  } catch { /* non indispensabile */ }
}

// ---------- assorbimento dei task remoti nel DB locale ----------

const COLS =
  "id,tweek_id,hash,deleted_at,text,done,date,list_id,color,note,checklist,freq,recurrence,dt_start,iso_date,recurring_todo_id,is_virtual";

async function absorb(tasks: TweekTask[], calendarId: string, imported: boolean) {
  const db = admin();
  const rows = tasks.map((t) => toRow(t, calendarId));
  let created = 0, updated = 0;
  const nowIso = new Date().toISOString();

  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const { data: existing, error } = await db
      .from("tw_tasks").select(COLS).in("tweek_id", chunk.map((r) => r.tweek_id));
    if (error) throw new Error(error.message);
    const byId = new Map((existing ?? []).map((e) => [e.tweek_id as string, e]));

    const inserts: Row[] = [];
    const events: Record<string, unknown>[] = [];

    for (const r of chunk) {
      const old = byId.get(r.tweek_id);
      if (!old) { inserts.push(r); continue; }
      if (old.hash === r.hash && !old.deleted_at) continue;

      const ch = diff(old, r);
      const patch: Record<string, unknown> = { ...r, updated_at: nowIso, deleted_at: null };
      if ("done" in ch) patch.completed_at = r.done ? nowIso : null;
      const { error: e2 } = await db.from("tw_tasks").update(patch).eq("id", old.id);
      if (e2) throw new Error(e2.message);
      updated++;
      events.push({
        task_id: old.id, tweek_id: r.tweek_id, source: "tweek", snapshot: snapshot(r),
        type: old.deleted_at ? "restored" : eventType(ch), changes: ch,
      });
    }

    if (inserts.length) {
      const withDone = inserts.map((r) => ({ ...r, completed_at: r.done ? nowIso : null }));
      const { data: ins, error: e3 } = await db
        .from("tw_tasks").upsert(withDone, { onConflict: "tweek_id", ignoreDuplicates: true })
        .select("id,tweek_id,text,date,done");
      if (e3) throw new Error(e3.message);
      created += ins?.length ?? 0;
      for (const t of ins ?? []) {
        events.push({
          task_id: t.id, tweek_id: t.tweek_id, source: "tweek", snapshot: snapshot(t),
          type: imported ? "imported" : "created", changes: null,
        });
      }
    }
    if (events.length) await db.from("tw_task_events").insert(events);
  }
  return { created, updated };
}

async function listAllStored(calendarId: string) {
  const out: TweekTask[] = [];
  let cursor: string | undefined;
  do {
    const r = await listTasks({ calendarId, startAt: cursor });
    out.push(...r.data);
    cursor = r.nextDocId ?? undefined;
  } while (cursor);
  // Salta le "basi" delle serie ricorrenti: le occorrenze arrivano dalla finestra espansa.
  return out.filter((t) => !(t.freq && !t.recurringTodoId));
}

// ---------- sync principale ----------

export type SyncResult = {
  skipped?: boolean; created: number; updated: number; removed: number; calendars: number;
};

export async function runSync(opts: { force?: boolean; full?: boolean } = {}): Promise<SyncResult> {
  const minSec = Number(process.env.SYNC_MIN_INTERVAL_SECONDS ?? 300);
  const last = await getState<{ at: string }>("last_sync");
  if (!opts.force && !opts.full && last && Date.now() - new Date(last.at).getTime() < minSec * 1000) {
    return { skipped: true, created: 0, updated: 0, removed: 0, calendars: 0 };
  }

  const db = admin();
  const now = Date.now();
  const from = iso(new Date(now - 21 * DAY));
  const to = iso(new Date(now + 70 * DAY)); // finestra di 91 giorni (max consentito: 92)
  const res: SyncResult = { created: 0, updated: 0, removed: 0, calendars: 0 };

  const cals = await getCalendars();
  await refreshTarget(cals);
  await syncTweekColors();

  for (const cal of cals) {
    res.calendars++;
    const map = new Map<string, TweekTask>();

    if (opts.full) for (const t of await listAllStored(cal.id)) map.set(t.id, t);

    const dated = await listTasks({
      calendarId: cal.id, expand: "occurrences", dateFrom: from, dateTo: to, timezone: TZ,
    });
    for (const t of dated.data) map.set(t.id, t);

    const someday = await listTasks({ calendarId: cal.id, someday: "true" });
    for (const t of someday.data) map.set(t.id, t);

    const r = await absorb([...map.values()], cal.id, !!opts.full && !last);
    res.created += r.created;
    res.updated += r.updated;

    // Task locali dentro la finestra che Tweek non restituisce più: li verifico uno a uno
    // (potrebbero essere solo stati spostati fuori finestra, non cancellati).
    const { data: local } = await db
      .from("tw_tasks").select("id,tweek_id,text,date,done")
      .eq("calendar_id", cal.id).is("deleted_at", null)
      .or(`and(date.gte.${from},date.lte.${to}),and(date.is.null,list_id.not.is.null)`);

    const missing = (local ?? []).filter((l) => !map.has(l.tweek_id)).slice(0, 25);
    for (const m of missing) {
      try {
        const t = await getTask(m.tweek_id);
        const x = await absorb([t], cal.id, false);
        res.updated += x.updated;
      } catch (e) {
        if (e instanceof TweekError && e.status === 404) {
          await db.from("tw_tasks").update({ deleted_at: new Date().toISOString() }).eq("id", m.id);
          await db.from("tw_task_events").insert({
            task_id: m.id, tweek_id: m.tweek_id, type: "deleted", source: "tweek",
            snapshot: snapshot(m), changes: null,
          });
          res.removed++;
        } else throw e;
      }
    }
  }

  await setState("last_sync", { at: new Date().toISOString(), ...res });
  return res;
}
