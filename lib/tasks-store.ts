import { admin } from "@/lib/supabase-admin";
import { createTask, deleteTask, getTask, updateTask } from "@/lib/tweek";
import { defaultTarget, diff, eventType, snapshot, toRow } from "@/lib/sync";

// Scrittura "write-through": prima Tweek, poi il DB locale. Se Tweek fallisce non cambia nulla.

export async function createLocalAndRemote(input: {
  text: string; date?: string | null; someday?: boolean; listId?: string | null;
  note?: string | null; color?: string | null;
}) {
  const target = await defaultTarget();
  const body: Record<string, unknown> = {
    calendarId: target.calendarId, text: input.text, done: false, gcal: false,
  };
  if (input.someday || !input.date) {
    const listId = input.listId ?? target.listId;
    if (!listId) throw new Error("Nessuna lista someday trovata in Tweek");
    body.listId = listId;
  } else body.date = input.date;
  if (input.note) body.note = input.note;
  if (input.color) body.color = input.color;

  const { id } = await createTask(body);
  const row = toRow(await getTask(id), target.calendarId);

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
    note?: string | null; color?: string | null; checklist?: unknown[] | null;
  }
) {
  const db = admin();
  const { data: old, error } = await db.from("tw_tasks").select("*").eq("id", localId).single();
  if (error || !old) throw new Error("Task non trovato");

  // Tweek rappresenta "nessun colore" con "blank" e "nessuna checklist" con un array vuoto.
  const remote: Record<string, unknown> = { ...patch };
  if ("color" in patch && !patch.color) remote.color = "blank";
  if ("checklist" in patch && !patch.checklist) remote.checklist = [];
  await updateTask(old.tweek_id, remote);
  const row = toRow(await getTask(old.tweek_id), old.calendar_id);
  const ch = diff(old, row);
  if (!Object.keys(ch).length) return old;

  const nowIso = new Date().toISOString();
  const upd: Record<string, unknown> = { ...row, updated_at: nowIso };
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
  if (error || !old) throw new Error("Task non trovato");

  await deleteTask(old.tweek_id);
  await db.from("tw_tasks").update({ deleted_at: new Date().toISOString() }).eq("id", localId);
  await db.from("tw_task_events").insert({
    task_id: localId, tweek_id: old.tweek_id, type: "deleted", source: "local",
    snapshot: snapshot(old), changes: null,
  });
}
