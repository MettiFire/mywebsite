export type Sub = { id?: string; text: string; done?: boolean } & Record<string, unknown>;

export type Task = {
  id: string;
  text: string;
  done: boolean;
  date: string | null;
  list_id: string | null;
  color: string | null;
  note: string | null;
  checklist: Sub[] | null;
  freq: number | null;
  recurring_todo_id: string | null;
  created_at?: string;
  pending?: boolean; // creato in locale, in attesa della risposta di Tweek
};

export type List = { id: string; name: string };

// Patch nel formato dell'API (/api/tasks/[id]).
export type Patch = Partial<{
  text: string; done: boolean; date: string | null; listId: string | null;
  note: string | null; color: string | null; checklist: Sub[] | null;
}>;

export function applyPatch(t: Task, p: Patch): Task {
  const { listId, ...rest } = p;
  const out: Task = { ...t, ...rest } as Task;
  if (listId !== undefined) out.list_id = listId;
  return out;
}
