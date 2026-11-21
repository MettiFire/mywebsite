"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Close } from "./icons";
import { longLabel, parse, WD } from "./dates";
import type { ActivityDay, CompletionStats } from "@/lib/tasks-stats";

type Stats = CompletionStats & { completed: number };

function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return <div><dt>{label}</dt><dd>{value}{detail && <span className="tk-stat-detail">{detail}</span>}</dd></div>;
}

function ActivityCalendar({ days }: { days: ActivityDay[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const grid = useRef<HTMLOListElement>(null);
  const selected = days.find((day) => day.date === selectedDate) ?? days.at(-1);
  const maximum = Math.max(1, ...days.map((day) => day.count));
  const padding = days.length ? (parse(days[0].date).getDay() + 6) % 7 : 0;
  const onKey = (e: KeyboardEvent<HTMLOListElement>) => {
    const delta: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    if (!selected || !(e.key in delta || e.key === "Home" || e.key === "End")) return;
    e.preventDefault();
    const current = days.findIndex((day) => day.date === selected.date);
    const next = e.key === "Home" ? 0 : e.key === "End" ? days.length - 1 : Math.max(0, Math.min(days.length - 1, current + delta[e.key]));
    setSelectedDate(days[next].date);
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${days[next].date}"]`)?.focus();
  };
  return <>
    <div className="tk-calendar-grid">
    <div className="tk-calendar-weekdays" aria-hidden="true">{WD.map((day) => <span key={day}>{day}</span>)}</div>
    <ol ref={grid} className="tk-heatmap" aria-label="Daily task completions, last 13 weeks" onKeyDown={onKey}>
      {Array.from({ length: padding }, (_, i) => <li key={`pad-${i}`} aria-hidden="true" />)}
      {days.map((day) => <li key={day.date}>
        <button type="button" data-date={day.date} data-level={day.count ? 1 + Math.floor(3 * day.count / maximum) : 0}
          title={`${longLabel(parse(day.date))}: ${day.count}`} aria-label={`${longLabel(parse(day.date))}: ${day.count} completions`}
          aria-pressed={selected?.date === day.date} tabIndex={selected?.date === day.date ? 0 : -1}
          onClick={() => setSelectedDate(day.date)} />
      </li>)}
    </ol>
    </div>
    <div className="tk-activity-dates"><span>{days.length ? longLabel(parse(days[0].date)) : ""}</span><span>Today</span></div>
    <p className="tk-calendar-selection" aria-live="polite">{selected ? `${longLabel(parse(selected.date))} · ${selected.count} completed` : "No activity yet"}</p>
  </>;
}

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
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialog) return;
      const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not([tabindex="-1"])')];
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

  const most = stats ? Math.max(...stats.weekdays) : 0;
  const best = stats && most > 0 ? WD.filter((_, i) => stats.weekdays[i] === most).join(", ") : "—";
  const maxPeriod = Math.max(1, ...(stats?.periods.map((period) => period.count) ?? []));

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
              <Metric label="Marked complete" value={stats.completed} />
              <Metric label="Last 28 days · here" value={stats.recent} />
              <Metric label="Most active weekday" value={best} detail="last 28 days" />
            </dl>
            <section className="tk-stats-section">
              <h3>Activity calendar</h3>
              <ActivityCalendar days={stats.calendar} />
              {!stats.firstActivityDate && <p className="tk-stat-caption">Complete a task here to start filling your calendar.</p>}
            </section>
            <section className="tk-stats-section">
              <h3>This week</h3>
              <dl className="tk-stats-pair">
                <Metric label="Completed" value={stats.comparison.current} />
                <Metric label="Same days last week" value={stats.comparison.previous} />
              </dl>
              <p className="tk-stat-caption">{stats.comparison.difference > 0 ? `${stats.comparison.difference} more than the same days last week.` : stats.comparison.difference < 0 ? `${Math.abs(stats.comparison.difference)} fewer than the same days last week.` : "The same number as the same days last week."}</p>
            </section>
            <section className="tk-stats-section">
              <h3>Personal records</h3>
              <dl className="tk-stats-pair">
                <Metric label="Best day" value={stats.records.day?.count ?? "—"} detail={stats.records.day ? longLabel(parse(stats.records.day.date)) : "Your first completion starts your records"} />
                <Metric label="Best week" value={stats.records.week?.count ?? "—"} detail={stats.records.week ? `Week of ${longLabel(parse(stats.records.week.date))}` : "No recorded week yet"} />
              </dl>
            </section>
            <section className="tk-stats-section">
              <h3>Finding your rhythm</h3>
              <dl className="tk-stats-summary">
                <Metric label="Active · last 7 days" value={`${stats.continuity.activeDays} / 7`} />
                <Metric label="Current streak" value={stats.continuity.currentStreak} detail="consecutive days" />
                <Metric label="Longest streak" value={stats.continuity.longestStreak} detail="consecutive days" />
              </dl>
            </section>
            <section className="tk-stats-section">
              <h3>When you finish tasks</h3>
              <p className="tk-stat-caption">Last 13 weeks · your local time</p>
              <ul className="tk-stat-periods">
                {stats.periods.map((period) => <li key={period.label}>
                  <div><span>{period.label}</span><span className="tk-stat-caption">{period.hours}</span></div>
                  <div className="tk-period-track" aria-hidden="true"><span style={{ width: `${period.count / maxPeriod * 100}%` }} /></div>
                  <span>{period.count}</span>
                </li>)}
              </ul>
            </section>
            <p className="tk-stats-note">The total includes saved tasks marked complete, excluding deleted tasks. Activity counts completions on this site, once per task per day. Tweek completions are excluded from activity because their original time is unavailable.{stats.firstActivityDate ? ` Records and streaks cover recorded activity since ${longLabel(parse(stats.firstActivityDate))}.` : ""}</p>
          </>}
        </div>
      </div>
    </div>
  );
}
