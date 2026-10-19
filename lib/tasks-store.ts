import { admin } from "@/lib/supabase-admin";
import { createTask, deleteTask, getTask, updateTask } from "@/lib/tweek";
import { defaultTarget, diff, eventType, snapshot, toRow } from "@/lib/sync";

// Scrittura "write-through": prima Tweek, poi il DB locale. Se Tweek fallisce non cambia nulla.
//
// Tweek free accetta via API solo i colori "pink" e "yellowish" e nessuna checklist:
// tutto il resto lo teniamo in tw_tasks.local (color, checklist, series_id).
// Anche l'ordine dentro un giorno/lista (sort): l'API di Tweek non lo espone.

const TWEEK_FREE_COLORS = new Set(["pink", "yellowish"]);

export type Local = { color?: string; checklist?: unknown[]; series_id?: string; sort?: number };
export type StoredRow = { color: string | null; checklist: unknown[] | null; local: Local | null };

// Colore → valore per Tweek + eventuale override locale.
function splitColor(c: string | null | undefined) {
  if (!c || c === "blank") return { remote: "blank", local: undefined };
  if (TWEEK_FREE_COLORS.has(c)) return { remote: c, local: undefined };
  return { remote: "blank", local: c };
}

export const effectiveColor = (r: StoredRow) => r.local?.color ?? r.color;
export const effectiveChecklist = (r: StoredRow) =>
  Array.isArray(r.local?.checklist) ? (r.local.checklist.length ? r.local.checklist : null) : r.checklist;

export async function createLocalAndRemote(input: {
  text: string; date?: string | null; someday?: boolean; listId?: string | null;
  note?: string | null; color?: string | null; seriesId?: string; calendarId?: string;
}) {
  const target = await defaultTarget();
  const calendarId = input.calendarId ?? target.calendarId;
  const body: Record<string, unknown> = { calendarId, text: input.text, done: false, gcal: false };
  if (input.someday || !input.date) {
    const listId = input.listId ?? target.listId;
    if (!listId) throw new Error("No someday list found in Tweek");
    body.listId = listId;
  } else body.date = input.date;
  if (input.note) body.note = input.note;
  const color = splitColor(input.color);
  if (color.remote !== "blank") body.color = color.remote;

  const local: Local = {};
  if (color.local) local.color = color.local;
  if (input.seriesId) local.series_id = input.seriesId;

  const { id } = await createTask(body);
  const row = { ...toRow(await getTask(id), calendarId), local };

  const db = admin();
  const { data, error } = await db.from("tw_tasks").upsert(row, { onConflict: "tweek_id" }).select("*").single();
  if (error) throw new Error(error.message);
  await db.from("tw_task_events").insert({
    task_id: data.id, tweek_id: id, type: "created", source: "local", snapshot: snapshot(data), changes: null,
  });
  return data;
}

export async function updateLocalAndRemote(
  localId: string,
  patch: {
    text?: string; done?: boolean; date?: string | null; listId?: string | null;
    note?: string | null; color?: string | null; checklist?: unknown[] | null; sort?: number;
  }
) {
  const db = admin();
  const { data: old, error } = await db.from("tw_tasks").select("*").eq("id", localId).single();
  if (error || !old) throw new Error("Task not found");

  const remote: Record<string, unknown> = { ...patch };
  const local: Local = { ...(old.local ?? {}) };
  const ch: Record<string, [unknown, unknown]> = {};

  if ("color" in patch) {
    const c = splitColor(patch.color);
    remote.color = c.remote;
    if (c.local) local.color = c.local; else delete local.color;
  }
  if ("checklist" in patch) {
    delete remote.checklist;
    local.checklist = patch.checklist ?? []; // [] = svuotata qui, nasconde l'eventuale checklist di Tweek
  }
  if ("sort" in patch) {
    delete remote.sort;
    if (local.sort !== patch.sort) ch.sort = [local.sort ?? null, patch.sort];
    local.sort = patch.sort;
  }
  // se in Tweek il colore resta uguale non serve chiamarlo
  if (remote.color !== undefined && remote.color === (old.color ?? "blank")) delete remote.color;

  let row = old;
  if (Object.keys(remote).length) {
    await updateTask(old.tweek_id, remote);
    row = toRow(await getTask(old.tweek_id), old.calendar_id);
    Object.assign(ch, diff(old, row));
  }
  const next = { ...row, local };
  if (effectiveColor(old) !== effectiveColor(next)) ch.color = [effectiveColor(old), effectiveColor(next)];
  if (JSON.stringify(effectiveChecklist(old)) !== JSON.stringify(effectiveChecklist(next))) {
    ch.checklist = [effectiveChecklist(old), effectiveChecklist(next)];
  }
  if (!Object.keys(ch).length) return old;

  const nowIso = new Date().toISOString();
  const upd: Record<string, unknown> = { ...row, local, updated_at: nowIso };
  delete upd.id;
  if ("done" in ch) upd.completed_at = row.done ? nowIso : null;
  const { data, error: e2 } = await db.from("tw_tasks").update(upd).eq("id", localId).select("*").single();
  if (e2) throw new Error(e2.message);
  await db.from("tw_task_events").insert({
    task_id: localId, tweek_id: old.tweek_id, type: eventType(ch), source: "local",
    snapshot: snapshot(data), changes: ch,
  });
  return data;
}

export async function deleteLocalAndRemote(localId: string) {
  const db = admin();
  const { data: old, error } = await db.from("tw_tasks").select("*").eq("id", localId).single();
  if (error || !old) throw new Error("Task not found");

  await deleteTask(old.tweek_id);
  await db.from("tw_tasks").update({ deleted_at: new Date().toISOString() }).eq("id", localId);
  await db.from("tw_task_events").insert({
    task_id: localId, tweek_id: old.tweek_id, type: "deleted", source: "local",
    snapshot: snapshot(old), changes: null,
  });
}
