const BASE = "https://tweek.so/api/v1";

export type TweekTask = {
  id: string;
  calendarId?: string;
  text?: string;
  done?: boolean;
  date?: string | null;
  listId?: string | null;
  color?: string | null;
  note?: string | null;
  checklist?: unknown[] | null;
  freq?: number | null;
  recurrence?: string | null;
  dtStart?: string | null;
  isoDate?: string | null;
  recurringTodoId?: string | null;
  virtual?: boolean;
};

export type TweekCalendar = {
  id: string;
  name: string;
  isDefault?: boolean;
  role?: string;
  lists?: { id: string; name: string }[];
};

export class TweekError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = process.env.TWEEK_API_KEY;
  if (!key) throw new Error("TWEEK_API_KEY mancante");
  const res = await fetch(BASE + path, {
    ...init,
    cache: "no-store",
    headers: { "X-API-Key": key, "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) throw new TweekError(res.status, `Tweek ${res.status}: ${await res.text()}`);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

const qs = (p: Record<string, string | undefined>) => {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined) u.set(k, v);
  return "?" + u.toString();
};

export const getCalendars = async () => {
  const r = await call<TweekCalendar[] | { data: TweekCalendar[] }>("/calendars");
  return Array.isArray(r) ? r : r.data;
};

export const listTasks = (p: Record<string, string | undefined>) =>
  call<{ data: TweekTask[]; nextDocId: string | null }>("/tasks" + qs(p));

export const getTask = (id: string) => call<TweekTask>(`/tasks/${encodeURIComponent(id)}`);

export const createTask = (body: Record<string, unknown>) =>
  call<{ id: string }>("/tasks", { method: "POST", body: JSON.stringify(body) });

export const updateTask = (id: string, body: Record<string, unknown>) =>
  call<unknown>(`/tasks/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) });

export const deleteTask = (id: string) =>
  call<void>(`/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
