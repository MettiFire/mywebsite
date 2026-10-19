"use client";

import { useCallback, useEffect, useState } from "react";

type Task = { id: string; text: string; done: boolean; date: string | null };
type Ev = {
  id: number; type: string; source: string; at: string;
  snapshot: { text?: string; date?: string | null } | null;
};

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const mondayOf = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return addDays(x, -((x.getDay() + 6) % 7));
};
const WD = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];
const EV_LABEL: Record<string, string> = {
  created: "creato", completed: "completato", reopened: "riaperto", moved: "spostato",
  updated: "modificato", deleted: "eliminato", imported: "importato", restored: "ripristinato",
};

function AddInput({ onAdd, placeholder }: { onAdd: (t: string) => void; placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <input
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); }
      }}
      className="w-full bg-transparent border-b border-neutral-400/30 py-1 text-sm outline-none placeholder:text-text-secondary/60 focus:border-text-primary"
    />
  );
}

function TaskItem({ t, onToggle, onDelete }: { t: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <li className="group flex items-start gap-2 text-sm">
      <input type="checkbox" checked={t.done} onChange={onToggle} className="mt-1 accent-current" />
      <span className={`flex-1 break-words ${t.done ? "line-through text-text-secondary" : ""}`}>{t.text}</span>
      <button
        onClick={onDelete}
        aria-label="elimina"
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-text-secondary"
      >
        ×
      </button>
    </li>
  );
}

export default function TasksApp() {
  const [week, setWeek] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [someday, setSomeday] = useState<Task[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);
  const [view, setView] = useState<"week" | "history">("week");
  const [status, setStatus] = useState("");

  useEffect(() => setWeek(mondayOf(new Date())), []);

  const load = useCallback(async () => {
    if (!week) return;
    const res = await fetch(`/api/tasks?from=${fmt(week)}&to=${fmt(addDays(week, 6))}`);
    if (res.status === 401) { window.location.href = "/tasks/login"; return; }
    const j = await res.json();
    if (j.error) { setStatus(j.error); return; }
    setTasks(j.tasks); setSomeday(j.someday);
  }, [week]);

  const sync = useCallback(async (force = false) => {
    setStatus("sync…");
    const res = await fetch(`/api/tasks/sync${force ? "?force=1" : ""}`, { method: "POST" });
    const j = await res.json();
    if (j.error) setStatus(`errore sync: ${j.error}`);
    else if (j.skipped) setStatus("");
    else setStatus(`sync ok · +${j.created} ~${j.updated} −${j.removed}`);
    await load();
  }, [load]);

  useEffect(() => { if (week) sync(false); }, [week]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!week) return;
    const onVis = () => { if (document.visibilityState === "visible") sync(false); };
    document.addEventListener("visibilitychange", onVis);
    const id = setInterval(load, 60_000); // legge solo il DB locale: nessun costo di quota Tweek
    return () => { document.removeEventListener("visibilitychange", onVis); clearInterval(id); };
  }, [week, sync, load]);

  useEffect(() => {
    if (view !== "history") return;
    fetch("/api/tasks/history?limit=200").then((r) => r.json()).then((j) => setEvents(j.events ?? []));
  }, [view]);

  async function api(path: string, init: RequestInit) {
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json" } });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setStatus(j.error ?? `errore ${res.status}`); await load(); return null; }
    return j;
  }

  const add = async (text: string, date: string | null) => {
    const j = await api("/api/tasks", { method: "POST", body: JSON.stringify({ text, date, someday: !date }) });
    if (j) await load();
  };
  const toggle = async (t: Task) => {
    const flip = (l: Task[]) => l.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x));
    setTasks(flip); setSomeday(flip);
    await api(`/api/tasks/${t.id}`, { method: "PATCH", body: JSON.stringify({ done: !t.done }) });
  };
  const remove = async (t: Task) => {
    setTasks((l) => l.filter((x) => x.id !== t.id)); setSomeday((l) => l.filter((x) => x.id !== t.id));
    await api(`/api/tasks/${t.id}`, { method: "DELETE" });
  };

  if (!week) return null;
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const today = fmt(new Date());
  const btn = "text-sm text-text-secondary hover:text-link-hover";

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button className={btn} onClick={() => setWeek(addDays(week, -7))}>←</button>
        <button className={btn} onClick={() => setWeek(mondayOf(new Date()))}>oggi</button>
        <button className={btn} onClick={() => setWeek(addDays(week, 7))}>→</button>
        <span className="text-sm">
          {days[0].getDate()}/{days[0].getMonth() + 1} – {days[6].getDate()}/{days[6].getMonth() + 1}
        </span>
        <span className="flex-1" />
        <span className="text-xs text-text-secondary">{status}</span>
        <button className={btn} onClick={() => sync(true)}>sincronizza</button>
        <button className={btn} onClick={() => setView(view === "week" ? "history" : "week")}>
          {view === "week" ? "storico" : "settimana"}
        </button>
      </div>

      {view === "week" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-5">
            {days.map((d, i) => {
              const key = fmt(d);
              const list = tasks.filter((t) => t.date === key);
              return (
                <section key={key} className={`flex flex-col gap-2 ${key === today ? "" : "opacity-90"}`}>
                  <h3 className={`text-sm border-b border-neutral-400/40 pb-1 ${key === today ? "font-semibold" : "text-text-secondary"}`}>
                    {WD[i]} {d.getDate()}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {list.map((t) => (
                      <TaskItem key={t.id} t={t} onToggle={() => toggle(t)} onDelete={() => remove(t)} />
                    ))}
                  </ul>
                  <AddInput placeholder="+" onAdd={(text) => add(text, key)} />
                </section>
              );
            })}
          </div>

          <section className="mt-12 max-w-md">
            <h3 className="text-sm border-b border-neutral-400/40 pb-1 mb-2 text-text-secondary">someday</h3>
            <ul className="flex flex-col gap-1.5 mb-2">
              {someday.map((t) => (
                <TaskItem key={t.id} t={t} onToggle={() => toggle(t)} onDelete={() => remove(t)} />
              ))}
            </ul>
            <AddInput placeholder="+" onAdd={(text) => add(text, null)} />
          </section>
        </>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex gap-4">
              <span className="w-40 shrink-0 text-right italic text-text-secondary">
                {new Date(e.at).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}
              </span>
              <span className="w-24 shrink-0 text-text-secondary">{EV_LABEL[e.type] ?? e.type}</span>
              <span className="flex-1 break-words">{e.snapshot?.text}</span>
              <span className="text-xs text-text-secondary">{e.source === "tweek" ? "tweek" : "qui"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
