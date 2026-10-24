"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { colorOf, setTweekColors } from "./colors";
import { MONTHS, WD, addDays, dayLabel, fmt, isoWeek, mondayOf, parse } from "./dates";
import { Check, ChevronLeft, ChevronRight, Note, Repeat, Subtasks, Sync, User } from "./icons";
import HistoryPanel from "./HistoryPanel";
import { THEMES } from "./themes";
import TaskModal from "./TaskModal";
import { applyPatch, type List, type Patch, type Task } from "./types";
import { byOrder, insertionOrder } from "./task-order";
import { useWeekEdgeDrag, WEEK_EDGE_LEFT, WEEK_EDGE_RIGHT } from "./useWeekEdgeDrag";

// Una "cella" è un giorno ("d:YYYY-MM-DD") o una lista someday ("l:<listId>").
type Key = string;
const dayKey = (d: string) => `d:${d}`;
const listKey = (id: string) => `l:${id}`;

const ROW = 42;

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
        aria-label="New task"
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

// Contenuto della riga: il contenitore trascinabile sta in renderRows.
function TaskRow({ t, onToggle }: { t: Task; onToggle: () => void }) {
  const color = colorOf(t.color);
  const subs = t.checklist?.length ?? 0;
  const subsDone = t.checklist?.filter((s) => s.done).length ?? 0;
  return (
    <>
      <span
        className={`tk-label ${color ? "colored" : ""}`}
        style={color ? { background: color.bg, color: color.fg } : undefined}
      >
        {t.text}
      </span>
      {(t.note || subs > 0 || t.freq || t.repeat) && (
        <span className="tk-meta">
          {t.freq || t.repeat ? <Repeat /> : null}
          {t.note ? <Note /> : null}
          {subs > 0 && <><Subtasks />{subsDone}/{subs}</>}
        </span>
      )}
      <button
        className="tk-check"
        aria-label={t.done ? "Mark as not done" : "Complete"}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {!t.done && <Check />}
      </button>
    </>
  );
}

// ---------------------------------------------------------------- app

export default function TasksApp() {
  const mobile = useMobile();
  const { theme, setTheme } = useTheme();
  const [week, setWeek] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [lists, setLists] = useState<List[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [adding, setAdding] = useState<Key | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [history, setHistory] = useState(false);
  const [menu, setMenu] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncErr, setSyncErr] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [toast, setToast] = useState("");
  const mutationQueues = useRef(new Map<string, Promise<void>>());
  const revision = useRef(0);
  const dragActive = useRef(false);
  const inflight = useRef(new Map<string, number>()); // id → richieste in corso

  useEffect(() => setWeek(mondayOf(new Date())), []);

  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 5000);
  }, []);

  // ------------------------------------------------ caricamento

  const load = useCallback(async (targetWeek = week, duringTransfer = false) => {
    if (!targetWeek || (dragActive.current && !duringTransfer)) return;
    // settimana visibile + quella prima e le due dopo: la navigazione resta istantanea
    const from = fmt(addDays(targetWeek, -7));
    const to = fmt(addDays(targetWeek, 20));
    const startedAtRevision = revision.current;
    const pendingAtStart = new Set(inflight.current.keys());
    const res = await fetch(`/api/tasks?from=${from}&to=${to}`);
    if (res.status === 401) { window.location.href = "/tasks/login"; return; }
    const j = await res.json().catch(() => ({ error: `error ${res.status}` }));
    if (j.error) { notify(j.error); return; }
    if (dragActive.current && !duringTransfer) return;
    if (j.lists?.length) setLists(j.lists);
    if (j.palette) setPalette(j.palette);
    if (j.tweekColors) setTweekColors(j.tweekColors);
    setTasks((cur) => {
      if ((dragActive.current && !duringTransfer) || startedAtRevision !== revision.current) return cur;
      const next: Record<string, Task> = {};
      // tengo ciò che è fuori finestra, ciò che è in volo e i task ancora da creare
      for (const t of Object.values(cur)) {
        const inWindow = t.date === null || (t.date >= from && t.date <= to);
        if (!inWindow || t.pending || pendingAtStart.has(t.id) || inflight.current.has(t.id)) next[t.id] = t;
      }
      for (const t of [...j.tasks, ...j.someday] as Task[]) {
        if (!pendingAtStart.has(t.id) && !inflight.current.has(t.id)) next[t.id] = t;
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
      const j = await res.json().catch(() => ({ error: `error ${res.status}` }));
      if (j.error) { setSyncErr(j.error); if (mode !== "auto") notify(`Sync failed: ${j.error}`); }
      else { setSyncErr(""); if (!j.skipped) setLastSync(new Date()); }
    } finally {
      setSyncing(false);
    }
    await load();
  }, [load, notify]);

  // Apertura, ricaricamento e navigazione leggono solo Supabase.
  // Il sync con Tweek parte esclusivamente dai comandi espliciti dell’utente.
  useEffect(() => {
    if (week) void load();
  }, [week, load]);

  useEffect(() => {
    if (!week) return;
    // Aggiorna solo dal DB locale: nessuna sincronizzazione periodica con Tweek.
    const id = setInterval(() => { if (document.visibilityState === "visible") load(); }, 60_000);
    return () => clearInterval(id);
  }, [week, load]);

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
    if (!res.ok) throw new Error(j.error ?? `error ${res.status}`);
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
      notify(`Not saved: ${(e as Error).message}`);
    }
  };

  const patch = async (id: string, p: Patch) => {
    if (id.startsWith("tmp-")) return;
    revision.current++;
    setTasks((c) => (c[id] ? { ...c, [id]: applyPatch(c[id], p) } : c));
    track(id, 1);
    const previous = mutationQueues.current.get(id) ?? Promise.resolve();
    const request = previous.catch(() => {}).then(async () => {
      const j = await call(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(p) });
      if (track(id, -1) === 0 && j?.task) setTasks((c) => (c[id] ? { ...c, [id]: j.task } : c));
      // cambiare ricorrenza crea o cancella occorrenze, e modificarla aggiorna le prossime
      if ("repeat" in p || (j?.task?.repeat && ("text" in p || "color" in p || "note" in p))) load();
    }).catch((e) => {
      if (track(id, -1) === 0) void load();
      notify(`Change not saved: ${(e as Error).message}`);
    });
    mutationQueues.current.set(id, request);
    await request;
    if (mutationQueues.current.get(id) === request) mutationQueues.current.delete(id);
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
      notify(`Not deleted: ${(e as Error).message}`);
    }
  };

  const savePalette = async (method: "POST" | "DELETE", hex: string) => {
    try {
      const j = method === "POST"
        ? await call("/api/tasks/palette", { method, body: JSON.stringify({ color: hex }) })
        : await call(`/api/tasks/palette?color=${encodeURIComponent(hex)}`, { method });
      if (j?.palette) setPalette(j.palette);
    } catch (e) {
      notify(`Color not saved: ${(e as Error).message}`);
    }
  };

  // Sposta il task nella cella `key` alla posizione `index` (tra i vicini), come fa Tweek.
  const moveTo = (id: string, key: Key, index: number) => {
    const t = tasks[id];
    if (!t) return;
    const order = insertionOrder(cells.get(key) ?? [], id, index);
    const p: Patch = { sort: order.find((item) => item.id === id)!.sort };
    if (key.startsWith("d:")) {
      const date = key.slice(2);
      if (t.date !== date) Object.assign(p, { date, listId: null });
    } else {
      const listId = key.slice(2) || null;
      if (t.date !== null || t.list_id !== listId) Object.assign(p, { date: null, listId });
    }
    // Ranks for neighbours are local-only writes; the moved task also saves its date/list.
    for (const item of order) {
      if (item.id !== id && !tasks[item.id]?.pending) void patch(item.id, { sort: item.sort });
    }
    void patch(id, p);
  };

  const onDragEnd = (result: DropResult) => {
    if (weekEdges.onDragEnd(result)) return;
    const { draggableId: id, source, destination } = result;
    dragActive.current = false;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveTo(id, destination.droppableId, destination.index);
  };

  // ------------------------------------------------ tastiera e menu

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (dragActive.current || openId || history || el.closest("input, textarea, [contenteditable]")) return;
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
    for (const l of m.values()) l.sort(byOrder);
    return m;
  }, [tasks, lists]);

  const weekEdges = useWeekEdgeDrag({
    canShift: (id) => !!tasks[id]?.date && !tasks[id]?.pending && !tasks[id]?.freq && !tasks[id]?.recurring_todo_id,
    shift: async (id, direction) => {
      const task = tasks[id];
      if (!week || !task?.date) return;
      const nextWeek = addDays(week, direction * 7);
      const date = fmt(addDays(parse(task.date), direction * 7));
      moveTo(id, dayKey(date), (cells.get(dayKey(date)) ?? []).length);
      setWeek(nextWeek);
      await load(nextWeek, true);
    },
    finish: () => { dragActive.current = false; void load(); },
    onError: notify,
  });

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
    weekdayRows = Math.max(10, ...keys.slice(0, 5).map(need), satRows + 2 + Math.max(3, need(keys[6])));
  }
  const rowsFor = (k: Key) => {
    if (mobile) return need(k);
    if (k === keys[5]) return satRows;
    if (k === keys[6]) return weekdayRows - satRows - 2; // una riga bianca di separazione e una per il titolo di domenica
    return weekdayRows;
  };
  const somedayRows = mobile ? 0 : Math.max(2, ...somedayLists.map((l) => need(listKey(l.id))));

  const renderRows = (k: Key, total: number) => {
    const list = cells.get(k) ?? [];
    // Le righe vuote sono disegnate dallo sfondo: così la colonna non salta durante il drag.
    const rows = Math.max(total, list.length + (adding === k ? 1 : 0) + 1);
    return (
      <Droppable droppableId={k}>
        {(provided, snap) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`tk-rows ${snap.isDraggingOver ? "drop" : ""}`}
            style={{ minHeight: rows * ROW }}
            onClick={(e) => { if (e.target === e.currentTarget) setAdding(k); }}
          >
            {list.map((t, i) => (
              <Draggable key={t.id} draggableId={t.id} index={i} isDragDisabled={!!t.pending}>
                {(p, s) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    className={`tk-row task ${t.done ? "done" : ""} ${t.pending ? "pending" : ""} ${s.isDragging ? "dragging" : ""}`}
                    onClick={() => setOpenId(t.id)}
                    data-task-id={t.id}
                    title={t.text}
                  >
                    <TaskRow t={t} onToggle={() => patch(t.id, { done: !t.done })} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {adding === k && (
              <AddRow onSubmit={(text) => create(text, k)} onClose={() => setAdding((a) => (a === k ? null : a))} />
            )}
          </div>
        )}
      </Droppable>
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
        <button className={`tk-title ${fmt(week) !== fmt(mondayOf(new Date())) ? "away" : ""}`} onClick={() => setWeek(mondayOf(new Date()))} title="Back to today (T)">
          <span className="long">{MONTHS[thursday.getMonth()]}</span>
          <span className="short">{MONTHS[thursday.getMonth()].slice(0, 3)}</span> {thursday.getFullYear()}
          <span className="wk">W{isoWeek(week)}</span>
        </button>
        <div className="tk-actions">
          <button
            className="tk-btn"
            aria-label="Sync with Tweek"
            title={syncErr ? `Sync error: ${syncErr}` : "Sync with Tweek"}
            onClick={() => sync("force")}
            disabled={syncing}
          >
            <Sync width={18} height={18} className={syncing ? "tk-spin" : ""} />
            {syncErr && !syncing && <span className="dot" />}
          </button>
          <button className="tk-btn user" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
            <User width={20} height={20} />
          </button>
          <button className="tk-btn primary" aria-label="Previous week" onClick={() => setWeek(addDays(week, -7))}>
            <ChevronLeft />
          </button>
          <button className="tk-btn primary" aria-label="Next week" onClick={() => setWeek(addDays(week, 7))}>
            <ChevronRight />
          </button>

          {menu && (
            <div className="tk-menu">
              <button onClick={() => { setWeek(mondayOf(new Date())); setMenu(false); }}>Go to today</button>
              <button onClick={() => { setHistory(true); setMenu(false); }}>History</button>
              <button onClick={() => { sync("full"); setMenu(false); }}>Full resync</button>
              <div className="sep" />
              <div className="meta">Theme</div>
              <div className="tk-themes" role="radiogroup" aria-label="Theme">
                {[{ id: "system", label: "Auto", paper: "", ink: "" }, ...THEMES].map((t) => (
                  <button
                    key={t.id}
                    role="radio"
                    aria-checked={theme === t.id}
                    className={theme === t.id ? "sel" : ""}
                    onClick={() => setTheme(t.id)}
                  >
                    <span
                      className="prev"
                      style={{
                        background: t.id === "system"
                          ? "linear-gradient(135deg, #fff 50%, #000 50%)"
                          : `linear-gradient(135deg, ${t.paper} 50%, ${t.ink} 50%)`,
                      }}
                    />
                    {t.label}
                  </button>
                ))}
              </div>
              <button
                onClick={async () => {
                  await fetch("/api/tasks/auth", { method: "DELETE" });
                  window.location.href = "/tasks/login";
                }}
              >
                Sign out
              </button>
              <div className="sep" />
              <div className="meta">
                {syncErr
                  ? `Sync error: ${syncErr}`
                  : lastSync
                    ? `Synced at ${lastSync.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                    : "Synced with Tweek"}
                <br />← → weeks · T today
              </div>
            </div>
          )}
        </div>
      </header>

      <DragDropContext
        onBeforeCapture={(before) => { dragActive.current = true; setAdding(null); weekEdges.onDragStart(before); }}
        sensors={[weekEdges.sensor]}
        onDragStart={weekEdges.onDragStart}
        onDragEnd={onDragEnd}
        dragHandleUsageInstructions="Drag to reorder or move to another day or list. With the keyboard, press Space to pick up, arrow keys to move, Space to drop, or Escape to cancel."
      >
      {[WEEK_EDGE_LEFT, WEEK_EDGE_RIGHT].map((id) => {
        const direction = id === WEEK_EDGE_LEFT ? -1 : 1;
        return (
          <Droppable key={id} droppableId={id} isDropDisabled={!weekEdges.enabled}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`tk-week-edge ${weekEdges.enabled ? "on" : ""} ${direction < 0 ? "left" : "right"} ${weekEdges.edge === direction ? "over" : ""}`}
                style={{ top: weekEdges.band.top, height: weekEdges.band.height }}
                aria-hidden={!weekEdges.enabled}
                aria-label={direction < 0 ? "Move to previous week" : "Move to next week"}
              >
                {direction < 0 ? <ChevronLeft /> : <ChevronRight />}
                <div className="tk-edge-placeholder">{provided.placeholder}</div>
              </div>
            )}
          </Droppable>
        );
      })}
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
      </DragDropContext>

      {openTask && (
        <TaskModal
          key={openTask.id}
          task={openTask}
          lists={lists}
          palette={palette}
          onAddColor={(hex) => savePalette("POST", hex)}
          onRemoveColor={(hex) => savePalette("DELETE", hex)}
          onPatch={(p) => patch(openTask.id, p)}
          onDelete={() => remove(openTask.id)}
          onClose={() => setOpenId(null)}
        />
      )}
      {history && <HistoryPanel onClose={() => setHistory(false)} />}

      {toast && (
        <div className="tk-toast" role="status">
          {toast}
          <button onClick={() => setToast("")} aria-label="Close">✕</button>
        </div>
      )}
    </div>
  );
}
