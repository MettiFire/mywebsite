"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { COLORS, colorOf } from "./colors";
import { longLabel, parse } from "./dates";
import { Calendar, Check, CheckFilled, Close, Palette, Repeat, Subtasks, Trash } from "./icons";
import type { List, Patch, Sub, Task } from "./types";

function autosize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "0px";
  el.style.height = el.scrollHeight + "px";
}

// Confronta solo ciò che si edita qui: Tweek può aggiungere id e altri campi alle subtask.
const subKey = (l: Sub[] | null) => JSON.stringify((l ?? []).map((s) => [s.text, !!s.done]));
const sameSubs = (a: Sub[] | null, b: Sub[] | null) => subKey(a) === subKey(b);

export default function TaskModal({
  task, lists, onPatch, onDelete, onClose,
}: {
  task: Task;
  lists: List[];
  onPatch: (p: Patch) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(task.text);
  const [note, setNote] = useState(task.note ?? "");
  const [subs, setSubs] = useState<Sub[]>(task.checklist ?? []);
  const [pop, setPop] = useState<null | "color" | "date">(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const subRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusSub = useRef<number | null>(null);

  useLayoutEffect(() => autosize(titleRef.current), [text]);
  useLayoutEffect(() => autosize(noteRef.current), [note]);
  useEffect(() => {
    if (focusSub.current !== null) { subRefs.current[focusSub.current]?.focus(); focusSub.current = null; }
  }, [subs]);

  // Salva testo/note/subtask in un'unica PATCH alla chiusura.
  const flush = () => {
    const p: Patch = {};
    const t = text.trim();
    if (t && t !== task.text) p.text = t;
    if ((note.trim() || null) !== (task.note || null)) p.note = note.trim() || null;
    const clean = subs.filter((s) => s.text.trim());
    if (!sameSubs(clean, task.checklist)) p.checklist = clean.length ? clean : null;
    if (Object.keys(p).length) onPatch(p);
  };
  const close = () => { flush(); onClose(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (pop) setPop(null); else close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const where = task.date
    ? longLabel(parse(task.date))
    : `Someday · ${lists.find((l) => l.id === task.list_id)?.name || "lista"}`;
  const color = colorOf(task.color);

  const setSub = (i: number, s: Partial<Sub>) => setSubs((l) => l.map((x, j) => (j === i ? { ...x, ...s } : x)));
  const addSub = (at: number) => {
    focusSub.current = at;
    setSubs((l) => [...l.slice(0, at), { text: "", done: false }, ...l.slice(at)]);
  };
  const toggleSub = (i: number) => {
    const next = subs.map((x, j) => (j === i ? { ...x, done: !x.done } : x));
    setSubs(next);
    const clean = next.filter((s) => s.text.trim());
    onPatch({ checklist: clean.length ? clean : null });
  };

  return (
    <div className="tk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="tk-modal" role="dialog" aria-label="Task">
        <div className="tk-mtop">
          <button className="tk-chip" onClick={() => setPop(pop === "date" ? null : "date")}>
            <Calendar /> {where}
          </button>
          {task.freq ? <span title="Task ricorrente" style={{ color: "var(--tk-muted)", display: "grid" }}><Repeat width={18} height={18} /></span> : null}
          <button className="tk-btn close" aria-label="Chiudi" onClick={close}><Close width={18} height={18} /></button>

          {pop === "date" && (
            <div className="tk-datepop">
              <input
                type="date"
                defaultValue={task.date ?? ""}
                onChange={(e) => {
                  if (!e.target.value) return;
                  onPatch({ date: e.target.value, listId: null });
                  setPop(null);
                }}
              />
              {lists.length > 0 && <div className="lbl">Someday</div>}
              {lists.map((l) => (
                <button
                  key={l.id}
                  className={!task.date && task.list_id === l.id ? "sel" : ""}
                  onClick={() => { onPatch({ date: null, listId: l.id }); setPop(null); }}
                >
                  {l.name || "Someday"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`tk-mtitle ${task.done ? "done" : ""}`}>
          <textarea
            ref={titleRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value.replace(/\n/g, ""))}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); noteRef.current?.focus(); } }}
            onBlur={flush}
          />
          <button
            className="tk-check"
            aria-label={task.done ? "Segna da fare" : "Completa"}
            onClick={() => onPatch({ done: !task.done })}
            style={task.done ? { color: "var(--tk-muted)" } : undefined}
          >
            {task.done ? <CheckFilled width={24} height={24} /> : <Check width={24} height={24} />}
          </button>
        </div>

        {subs.length > 0 && (
          <div className="tk-subs">
            {subs.map((s, i) => (
              <div key={i} className={`tk-sub ${s.done ? "done" : ""}`}>
                <button aria-label="Completa subtask" onClick={() => toggleSub(i)}>
                  {s.done ? <CheckFilled /> : <Check />}
                </button>
                <input
                  ref={(el) => { subRefs.current[i] = el; }}
                  value={s.text}
                  placeholder="Subtask"
                  onChange={(e) => setSub(i, { text: e.target.value })}
                  onBlur={flush}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addSub(i + 1); }
                    if (e.key === "Backspace" && !s.text) {
                      e.preventDefault();
                      focusSub.current = Math.max(0, i - 1);
                      setSubs((l) => l.filter((_, j) => j !== i));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={noteRef}
          className="tk-notes"
          placeholder="Aggiungi note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={flush}
        />

        <div className="tk-tools">
          <button className="tk-tool" aria-label="Aggiungi subtask" title="Subtask" onClick={() => addSub(subs.length)}>
            <Subtasks />
          </button>
          <button
            className={`tk-tool ${pop === "color" ? "on" : ""}`}
            aria-label="Colore"
            title="Colore"
            onClick={() => setPop(pop === "color" ? null : "color")}
          >
            {color ? <span className="swatch" style={{ background: color.bg, borderColor: color.bg }} /> : <Palette />}
          </button>
          <button
            className="tk-tool danger"
            aria-label="Elimina"
            title="Elimina"
            onClick={() => { onDelete(); onClose(); }}
          >
            <Trash />
          </button>

          {pop === "color" && (
            <div className="tk-pop">
              <button
                className={`tk-swatch none ${!color ? "sel" : ""}`}
                aria-label="Nessun colore"
                onClick={() => { onPatch({ color: null }); setPop(null); }}
              />
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  className={`tk-swatch ${task.color === c.id ? "sel" : ""}`}
                  style={{ background: c.bg }}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => { onPatch({ color: c.id }); setPop(null); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
