"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { colorOf } from "./colors";
import { MONTHS, WD, addDays, dayLabel, fmt, isoWeek, mondayOf } from "./dates";
import { Check, CheckFilled, ChevronLeft, ChevronRight, Note, Repeat, Subtasks, Sync, User } from "./icons";
import HistoryPanel from "./HistoryPanel";
import TaskModal from "./TaskModal";
import { applyPatch, type List, type Patch, type Task } from "./types";

// Una "cella" è un giorno ("d:YYYY-MM-DD") o una lista someday ("l:<listId>").
type Key = string;
const dayKey = (d: string) => `d:${d}`;
const listKey = (id: string) => `l:${id}`;

const byCreated = (a: Task, b: Task) =>
  Number(!!a.pending) - Number(!!b.pending) || (a.created_at ?? "").localeCompare(b.created_at ?? "");

function useMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 760px)");
    const on = () => setM(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return m;
}

// ---------------------------------------------------------------- righe

function AddRow({ onSubmit, onClose }: { onSubmit: (t: string) => void; onClose: () => void }) {
  const [v, setV] = useState("");
  return (
    <div className="tk-input-row">
      <input
        autoFocus
        value={v}
        enterKeyHint="done"
        aria-label="Nuovo task"
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (v.trim()) { onSubmit(v.trim()); setV(""); } else onClose();
          }
          if (e.key === "Escape") { e.stopPropagation(); onClose(); }
        }}
        onBlur={() => { if (v.trim()) onSubmit(v.trim()); onClose(); }}
      />
    </div>
  );
}

function TaskRow({
  t, dragging, onOpen, onToggle, onDragStart, onDragEnd,
}: {
  t: Task; dragging: boolean; onOpen: () => void; onToggle: () => void;
  onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void;
}) {
  const color = colorOf(t.color);
  const subs = t.checklist?.length ?? 0;
  const subsDone = t.checklist?.filter((s) => s.done).length ?? 0;
  return (
    <div
      className={`tk-row task ${t.done ? "done" : ""} ${t.pending ? "pending" : ""} ${dragging ? "dragging" : ""}`}
      draggable={!t.pending}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      title={t.text}
    >
      <span
        className={`tk-label ${color ? "colored" : ""}`}
        style={color ? { background: color.bg, color: color.fg } : undefined}
      >
        {t.text}
      </span>
      {(t.note || subs > 0 || t.freq) && (
        <span className="tk-meta">
          {t.freq ? <Repeat /> : null}
          {t.note ? <Note /> : null}
          {subs > 0 && <><Subtasks />{subsDone}/{subs}</>}
        </span>
      )}
      <button
        className="tk-check"
        aria-label={t.done ? "Segna da fare" : "Completa"}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {t.done ? <CheckFilled /> : <Check />}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- app

export default function TasksApp() {
  const mobile = useMobile();
  const [week, setWeek] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [lists, setLists] = useState<List[]>([]);
  const [adding, setAdding] = useState<Key | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [history, setHistory] = useState(false);
  const [menu, setMenu] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncErr, setSyncErr] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [toast, setToast] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropKey, setDropKey] = useState<Key | null>(null);
  const inflight = useRef(new Map<string, number>()); // id → richieste in corso

  useEffect(() => setWeek(mondayOf(new Date())), []);

  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 5000);
  }, []);

  // ------------------------------------------------ caricamento

  const load = useCallback(async () => {
    if (!week) return;
    // settimana visibile + quella prima e le due dopo: la navigazione resta istantanea
    const from = fmt(addDays(week, -7));
    const to = fmt(addDays(week, 20));
    const res = await fetch(`/api/tasks?from=${from}&to=${to}`);
    if (res.status === 401) { window.location.href = "/tasks/login"; return; }
    const j = await res.json().catch(() => ({ error: `errore ${res.status}` }));
    if (j.error) { notify(j.error); return; }
    if (j.lists?.length) setLists(j.lists);
    setTasks((cur) => {
      const next: Record<string, Task> = {};
      // tengo ciò che è fuori finestra, ciò che è in volo e i task ancora da creare
      for (const t of Object.values(cur)) {
        const inWindow = t.date === null || (t.date >= from && t.date <= to);
        if (!inWindow || t.pending || inflight.current.has(t.id)) next[t.id] = t;
      }
      for (const t of [...j.tasks, ...j.someday] as Task[]) {
        if (!inflight.current.has(t.id)) next[t.id] = t;
      }
      return next;
    });
  }, [week, notify]);

  const sync = useCallback(async (mode: "auto" | "force" | "full" = "auto") => {
    setSyncing(true);
    try {
      const q = mode === "force" ? "?force=1" : mode === "full" ? "?full=1" : "";
      const res = await fetch(`/api/tasks/sync${q}`, { method: "POST" });
      if (res.status === 401) { window.location.href = "/tasks/login"; return; }
      const j = await res.json().catch(() => ({ error: `errore ${res.status}` }));
      if (j.error) { setSyncErr(j.error); if (mode !== "auto") notify(`Sync non riuscito: ${j.error}`); }
      else { setSyncErr(""); if (!j.skipped) setLastSync(new Date()); }
    } finally {
      setSyncing(false);
    }
    await load();
  }, [load, notify]);

  // primo caricamento: prima il DB locale (veloce), poi il sync con Tweek
  const booted = useRef(false);
  useEffect(() => {
    if (!week) return;
    if (!booted.current) { booted.current = true; load().then(() => sync("auto")); }
    else load();
  }, [week]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!week) return;
    const onVis = () => { if (document.visibilityState === "visible") sync("auto"); };
    document.addEventListener("visibilitychange", onVis);
    const id = setInterval(() => { if (document.visibilityState === "visible") load(); }, 60_000);
    return () => { document.removeEventListener("visibilitychange", onVis); clearInterval(id); };
  }, [week, sync, load]);

  // ------------------------------------------------ mutazioni (ottimistiche)

  const track = (id: string, d: 1 | -1) => {
    const n = (inflight.current.get(id) ?? 0) + d;
    if (n > 0) inflight.current.set(id, n); else inflight.current.delete(id);
    return n;
  };

  async function call(path: string, init: RequestInit) {
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json" } });
    if (res.status === 401) { window.location.href = "/tasks/login"; return null; }
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error ?? `errore ${res.status}`);
    return j;
  }

  const create = async (text: string, key: Key) => {
    const isDay = key.startsWith("d:");
    const val = key.slice(2);
    const tmp: Task = {
      id: `tmp-${Math.random().toString(36).slice(2)}`, text, done: false, pending: true,
      date: isDay ? val : null, list_id: isDay ? null : val || null,
      color: null, note: null, checklist: null, freq: null, recurring_todo_id: null,
    };
    setTasks((c) => ({ ...c, [tmp.id]: tmp }));
    try {
      const body = isDay ? { text, date: val } : { text, someday: true, listId: val || null };
      const j = await call("/api/tasks", { method: "POST", body: JSON.stringify(body) });
      setTasks((c) => {
        const { [tmp.id]: _, ...rest } = c; // eslint-disable-line @typescript-eslint/no-unused-vars
        return j?.task ? { ...rest, [j.task.id]: j.task } : rest;
      });
    } catch (e) {
      setTasks((c) => { const { [tmp.id]: _, ...rest } = c; return rest; }); // eslint-disable-line @typescript-eslint/no-unused-vars
      notify(`Non salvato: ${(e as Error).message}`);
    }
  };

  const patch = async (id: string, p: Patch) => {
    if (id.startsWith("tmp-")) return;
    setTasks((c) => (c[id] ? { ...c, [id]: applyPatch(c[id], p) } : c));
    track(id, 1);
    try {
      const j = await call(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(p) });
      if (track(id, -1) === 0 && j?.task) setTasks((c) => (c[id] ? { ...c, [id]: j.task } : c));
    } catch (e) {
      track(id, -1);
      notify(`Modifica non salvata: ${(e as Error).message}`);
      load();
    }
  };

  const remove = async (id: string) => {
    if (id.startsWith("tmp-")) return;
    const prev = tasks[id];
    setTasks((c) => { const { [id]: _, ...rest } = c; return rest; }); // eslint-disable-line @typescript-eslint/no-unused-vars
    track(id, 1);
    try {
      await call(`/api/tasks/${id}`, { method: "DELETE" });
      track(id, -1);
    } catch (e) {
      track(id, -1);
      if (prev) setTasks((c) => ({ ...c, [id]: prev }));
      notify(`Non eliminato: ${(e as Error).message}`);
    }
  };

  const moveTo = (id: string, key: Key) => {
    const t = tasks[id];
    if (!t) return;
    if (key.startsWith("d:")) {
      const date = key.slice(2);
      if (t.date !== date) patch(id, { date, listId: null });
    } else {
      const listId = key.slice(2) || null;
      if (t.date !== null || t.list_id !== listId) patch(id, { date: null, listId });
    }
  };

  // ------------------------------------------------ tastiera e menu

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (openId || history || el.closest("input, textarea, [contenteditable]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") setWeek((w) => w && addDays(w, -7));
      if (e.key === "ArrowRight") setWeek((w) => w && addDays(w, 7));
      if (e.key === "t") setWeek(mondayOf(new Date()));
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, history]);

  useEffect(() => {
    if (!menu) return;
    const off = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest(".tk-menu, .tk-btn.user")) setMenu(false); };
    window.addEventListener("mousedown", off);
    return () => window.removeEventListener("mousedown", off);
  }, [menu]);

  // ------------------------------------------------ dati derivati

  const cells = useMemo(() => {
    const m = new Map<Key, Task[]>();
    const firstList = lists[0]?.id ?? "";
    const known = new Set(lists.map((l) => l.id));
    for (const t of Object.values(tasks)) {
      const k = t.date ? dayKey(t.date) : listKey(t.list_id && known.has(t.list_id) ? t.list_id : firstList);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(t);
    }
    for (const l of m.values()) l.sort(byCreated);
    return m;
  }, [tasks, lists]);

  if (!week) return null;

  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const keys = days.map((d) => dayKey(fmt(d)));
  const today = fmt(new Date());
  const thursday = days[3];
  const somedayLists: List[] = lists.length ? lists : [{ id: "", name: "Someday" }];
  const openTask = openId ? tasks[openId] : null;

  // righe necessarie per una cella: i task, l'eventuale input e almeno una riga vuota
  const need = (k: Key) => (cells.get(k)?.length ?? 0) + (adding === k ? 1 : 0) + 1;
  let weekdayRows = mobile ? 0 : 10, satRows = mobile ? 0 : 5;
  if (!mobile) {
    satRows = Math.max(5, need(keys[5]));
    weekdayRows = Math.max(10, ...keys.slice(0, 5).map(need), satRows + 1 + Math.max(4, need(keys[6])));
  }
  const rowsFor = (k: Key) => {
    if (mobile) return need(k);
    if (k === keys[5]) return satRows;
    if (k === keys[6]) return weekdayRows - satRows - 1; // l'intestazione di domenica occupa una riga
    return weekdayRows;
  };
  const somedayRows = mobile ? 0 : Math.max(2, ...somedayLists.map((l) => need(listKey(l.id))));

  const renderRows = (k: Key, total: number) => {
    const list = cells.get(k) ?? [];
    const empties = Math.max(total, list.length + (adding === k ? 1 : 0) + 1) - list.length - (adding === k ? 1 : 0);
    return (
      <div
        className={`tk-rows ${dropKey === k ? "drop" : ""}`}
        onDragOver={(e) => { if (dragId) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDropKey(k); } }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropKey((x) => (x === k ? null : x)); }}
        onDrop={(e) => { e.preventDefault(); if (dragId) moveTo(dragId, k); setDragId(null); setDropKey(null); }}
      >
        {list.map((t) => (
          <TaskRow
            key={t.id}
            t={t}
            dragging={dragId === t.id}
            onOpen={() => setOpenId(t.id)}
            onToggle={() => patch(t.id, { done: !t.done })}
            onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.text); e.dataTransfer.effectAllowed = "move"; setDragId(t.id); }}
            onDragEnd={() => { setDragId(null); setDropKey(null); }}
          />
        ))}
        {adding === k && (
          <AddRow onSubmit={(text) => create(text, k)} onClose={() => setAdding((a) => (a === k ? null : a))} />
        )}
        {Array.from({ length: empties }, (_, i) => (
          <div key={i} className="tk-row" onClick={() => setAdding(k)} />
        ))}
      </div>
    );
  };

  const dayCol = (i: number) => {
    const d = days[i];
    const k = keys[i];
    const iso = fmt(d);
    return (
      <>
        <div className={`tk-head ${iso === today ? "today" : ""}`}>
          <span className="d">{dayLabel(d)}</span>
          <span className="w">{WD[i]}</span>
        </div>
        {renderRows(k, rowsFor(k))}
      </>
    );
  };

  return (
    <div className="tk">
      <header className="tk-top">
        <button className="tk-title" onClick={() => setWeek(mondayOf(new Date()))} title="Torna a oggi (T)">
          {MONTHS[thursday.getMonth()]} {thursday.getFullYear()}
          <span className="wk">W{isoWeek(week)}</span>
        </button>
        <div className="tk-actions">
          <button
            className="tk-btn"
            aria-label="Sincronizza con Tweek"
            title={syncErr ? `Errore sync: ${syncErr}` : "Sincronizza con Tweek"}
            onClick={() => sync("force")}
            disabled={syncing}
          >
            <Sync width={18} height={18} className={syncing ? "tk-spin" : ""} />
            {syncErr && !syncing && <span className="dot" />}
          </button>
          <button className="tk-btn user" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            <User width={20} height={20} />
          </button>
          <button className="tk-btn primary" aria-label="Settimana precedente" onClick={() => setWeek(addDays(week, -7))}>
            <ChevronLeft />
          </button>
          <button className="tk-btn primary" aria-label="Settimana successiva" onClick={() => setWeek(addDays(week, 7))}>
            <ChevronRight />
          </button>

          {menu && (
            <div className="tk-menu">
              <button onClick={() => { setWeek(mondayOf(new Date())); setMenu(false); }}>Vai a oggi</button>
              <button onClick={() => { setHistory(true); setMenu(false); }}>Storico</button>
              <button onClick={() => { sync("full"); setMenu(false); }}>Risincronizza tutto</button>
              <button
                onClick={async () => {
                  await fetch("/api/tasks/auth", { method: "DELETE" });
                  window.location.href = "/tasks/login";
                }}
              >
                Esci
              </button>
              <div className="meta">
                {syncErr
                  ? `Errore sync: ${syncErr}`
                  : lastSync
                    ? `Sincronizzato alle ${lastSync.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`
                    : "Sincronizzato con Tweek"}
                <br />← → settimane · T oggi
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="tk-week">
        {[0, 1, 2, 3, 4].map((i) => <section key={keys[i]}>{dayCol(i)}</section>)}
        <section className="tk-weekend">
          {dayCol(5)}
          {dayCol(6)}
        </section>
      </main>

      <section className="tk-someday">
        {somedayLists.map((l, i) => {
          const k = listKey(l.id);
          return (
            <div key={k}>
              <div className="tk-list-head">
                {l.name || (i === 0 ? "Someday" : "")}
              </div>
              {renderRows(k, somedayRows)}
            </div>
          );
        })}
      </section>

      {openTask && (
        <TaskModal
          key={openTask.id}
          task={openTask}
          lists={lists}
          onPatch={(p) => patch(openTask.id, p)}
          onDelete={() => remove(openTask.id)}
          onClose={() => setOpenId(null)}
        />
      )}
      {history && <HistoryPanel onClose={() => setHistory(false)} />}

      {toast && (
        <div className="tk-toast" role="status">
          {toast}
          <button onClick={() => setToast("")} aria-label="Chiudi">✕</button>
        </div>
      )}
    </div>
  );
}
