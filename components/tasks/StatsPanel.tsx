"use client";

import { useEffect, useRef, useState } from "react";
import { Close } from "./icons";
import { longLabel, parse, WD } from "./dates";
import type { ActivityDay } from "@/lib/tasks-stats";

type Stats = { completed: number; days: ActivityDay[] };

export default function StatsPanel({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/tasks/stats?timeZone=${encodeURIComponent(timeZone)}`, { signal: controller.signal })
      .then(async (r) => {
        if (r.status === 401) { window.location.href = "/tasks/login"; return; }
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Could not load statistics.");
        setStats(data);
      })
      .catch((e: Error) => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = panel.current;
    dialog?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialog) return;
      const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
      const first = buttons[0], last = buttons.at(-1);
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [onClose]);

  const days = stats?.days ?? [];
  const recent = days.reduce((sum, day) => sum + day.count, 0);
  const maximum = Math.max(1, ...days.map((day) => day.count));
  const weekdays = Array<number>(7).fill(0);
  for (const day of days) weekdays[(parse(day.date).getDay() + 6) % 7] += day.count;
  const most = Math.max(...weekdays);
  const best = most > 0 ? WD.filter((_, i) => weekdays[i] === most).join(", ") : "—";

  return (
    <div className="tk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panel} className="tk-modal wide" role="dialog" aria-modal="true" aria-labelledby="tk-stats-title" tabIndex={-1}>
        <div className="tk-mtop">
          <h2 id="tk-stats-title" className="tk-stats-title">Statistics</h2>
          <button className="tk-btn close" aria-label="Close statistics" onClick={onClose}><Close width={18} height={18} /></button>
        </div>
        <div className="tk-stats-content">
          {error && <div role="alert"><p>{error}</p><button className="tk-btn" aria-label="Retry statistics" onClick={() => { setError(""); setAttempt((n) => n + 1); }}>↻</button></div>}
          {!stats && !error && <p role="status">Loading…</p>}
          {stats && <>
            <dl className="tk-stats-summary">
              <div><dt>Marked complete</dt><dd>{stats.completed}</dd></div>
              <div><dt>Last 28 days · here</dt><dd>{recent}</dd></div>
              <div><dt>Most active weekday</dt><dd>{best}</dd></div>
            </dl>
            <h3>Daily completions · last 28 days</h3>
            <ol className="tk-activity" aria-label="Daily task completions">
              {days.map((day) => <li key={day.date} aria-label={`${longLabel(parse(day.date))}: ${day.count}`} title={`${longLabel(parse(day.date))}: ${day.count}`}>
                <span style={{ height: `${day.count / maximum * 100}%` }} />
              </li>)}
            </ol>
            {days.length > 0 && <div className="tk-activity-dates"><span>{longLabel(parse(days[0].date))}</span><span>Today</span></div>}
            {!recent && <p>No completions recorded here in the last 28 days yet.</p>}
            <p className="tk-stats-note">The total includes all saved tasks marked complete, excluding deleted tasks. Activity counts tasks completed on this site, once per task per day. Tweek completions are excluded from activity because their original completion time is unavailable.</p>
          </>}
        </div>
      </div>
    </div>
  );
}
