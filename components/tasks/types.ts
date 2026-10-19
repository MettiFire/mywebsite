// Ricorrenze gestite dal nostro server (vedi lib/series.ts).
export const REPEATS = [
  { id: "daily", label: "Every day" },
  { id: "weekdays", label: "Every weekday" },
  { id: "weekly", label: "Every week" },
  { id: "biweekly", label: "Every 2 weeks" },
  { id: "monthly", label: "Every month" },
  { id: "yearly", label: "Every year" },
] as const;
export type Repeat = (typeof REPEATS)[number]["id"];
export const repeatLabel = (r: string | null | undefined) => REPEATS.find((x) => x.id === r)?.label ?? null;

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
  repeat?: Repeat | null;
  sort?: number | null; // ordine nel giorno/lista, salvato da noi
  created_at?: string;
  pending?: boolean; // creato in locale, in attesa della risposta di Tweek
};

export type List = { id: string; name: string };

// Patch nel formato dell'API (/api/tasks/[id]).
export type Patch = Partial<{
  text: string; done: boolean; date: string | null; listId: string | null;
  note: string | null; color: string | null; checklist: Sub[] | null; repeat: Repeat | null; sort: number;
}>;

export function applyPatch(t: Task, p: Patch): Task {
  const { listId, ...rest } = p;
  const out: Task = { ...t, ...rest } as Task;
  if (listId !== undefined) out.list_id = listId;
  return out;
}
