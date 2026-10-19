"use client";

import { useEffect, useState } from "react";
import { Close } from "./icons";
import { longLabel } from "./dates";

type Ev = {
  id: number; type: string; source: string; at: string;
  snapshot: { text?: string; date?: string | null } | null;
};

const EV_LABEL: Record<string, string> = {
  created: "created", completed: "completed", reopened: "reopened", moved: "moved",
  updated: "edited", deleted: "deleted", imported: "imported", restored: "restored",
};

export default function HistoryPanel({ onClose }: { onClose: () => void }) {
  const [events, setEvents] = useState<Ev[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tasks/history?limit=300")
      .then((r) => r.json())
      .then((j) => (j.error ? setError(j.error) : setEvents(j.events ?? [])))
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const groups: { day: string; items: Ev[] }[] = [];
  for (const e of events ?? []) {
    const day = longLabel(new Date(e.at));
    if (groups.at(-1)?.day !== day) groups.push({ day, items: [] });
    groups.at(-1)!.items.push(e);
  }

  return (
    <div className="tk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tk-modal wide" role="dialog" aria-label="History">
        <div className="tk-mtop">
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.6px" }}>History</span>
          <button className="tk-btn close" aria-label="Close" onClick={onClose}><Close width={18} height={18} /></button>
        </div>
        <div className="tk-hist">
          {error && <p className="s">{error}</p>}
          {!events && !error && <p className="s">Loading…</p>}
          {events?.length === 0 && <p className="s">No events yet.</p>}
          {groups.map((g) => (
            <section key={g.day}>
              <h4>{g.day}</h4>
              <ul>
                {g.items.map((e) => (
                  <li key={e.id}>
                    <span className="t">
                      {new Date(e.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="k">{EV_LABEL[e.type] ?? e.type}</span>
                    <span className="x">{e.snapshot?.text}</span>
                    <span className="s">{e.source === "tweek" ? "tweek" : "here"}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
