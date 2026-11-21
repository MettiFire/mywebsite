const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const file = path.resolve(__dirname, '../lib/tasks-stats.ts');
const compiled = new Module(file, module);
compiled._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, file);
const { completionStats } = compiled.exports;
const completionActivity = (...args) => completionStats(...args).days;
const event = (id, task_id, at) => ({ id, task_id, tweek_id: null, at });

test('uses local calendar days across midnight and excludes future/old events', () => {
  const days = completionActivity([
    event(1, 'a', '2026-11-19T23:30:00Z'),
    event(2, 'b', '2026-11-20T00:31:00Z'),
    event(3, 'c', '2026-10-23T21:59:00Z'),
  ], new Date('2026-11-20T00:30:00Z'), 'Europe/Rome');
  assert.equal(days.length, 28);
  assert.equal(days[0].date, '2026-10-24');
  assert.deepEqual(days.at(-1), { date: '2026-11-20', count: 1 });
  assert.equal(days.reduce((sum, d) => sum + d.count, 0), 1);
});

test('counts repeated completion of one task once per day, including deleted references', () => {
  const days = completionActivity([
    event(1, 'a', '2026-11-19T10:00:00Z'), event(2, 'a', '2026-11-19T11:00:00Z'),
    event(3, 'a', '2026-11-20T10:00:00Z'),
    { ...event(4, null, '2026-11-20T11:00:00Z'), tweek_id: 'deleted' },
    { ...event(5, null, '2026-11-20T12:00:00Z'), tweek_id: 'deleted' },
  ], new Date('2026-11-20T13:00:00Z'), 'UTC');
  assert.equal(days.at(-2).count, 1);
  assert.equal(days.at(-1).count, 2);
});

test('keeps all 28 calendar days through daylight saving and an empty history', () => {
  const days = completionActivity([], new Date('2026-11-03T10:00:00Z'), 'Europe/Rome');
  assert.equal(days[0].date, '2026-10-07');
  assert.equal(days.at(-1).date, '2026-11-03');
  assert.equal(new Set(days.map(d => d.date)).size, 28);
  assert.ok(days.every(d => d.count === 0));
});


test('compares matching weekdays rather than an unfinished week against a full week', () => {
  const stats = completionStats([
    event(1, 'a', '2026-11-16T09:00:00Z'),
    event(2, 'b', '2026-11-18T09:00:00Z'),
    event(3, 'c', '2026-11-09T09:00:00Z'),
    event(4, 'd', '2026-11-15T09:00:00Z'),
  ], new Date('2026-11-18T12:00:00Z'), 'UTC');
  assert.deepEqual(stats.comparison, { current: 2, previous: 1, difference: 1 });
});

test('finds historical records outside the calendar and lets an ongoing streak include yesterday', () => {
  const stats = completionStats([
    event(1, 'old-a', '2025-01-01T10:00:00Z'),
    event(2, 'old-b', '2025-01-01T11:00:00Z'),
    event(3, 'old-c', '2025-01-02T10:00:00Z'),
    event(4, 'a', '2026-11-18T10:00:00Z'),
    event(5, 'b', '2026-11-19T10:00:00Z'),
    event(6, 'c', '2026-11-20T10:00:00Z'),
  ], new Date('2026-11-21T09:00:00Z'), 'UTC');
  assert.deepEqual(stats.records.day, { date: '2025-01-01', count: 2 });
  assert.deepEqual(stats.records.week, { date: '2024-12-30', count: 3 });
  assert.deepEqual(stats.continuity, { activeDays: 3, currentStreak: 3, longestStreak: 3 });
  assert.equal(stats.calendar.length, 91);
  assert.equal(stats.days.length, 28);
  assert.equal(stats.recent, 3);
  assert.equal(stats.firstActivityDate, '2025-01-01');
});

test('assigns time bands in the local zone and uses the first completion for repeated toggles', () => {
  const stats = completionStats([
    event(2, 'a', '2026-11-21T14:00:00Z'),
    event(1, 'a', '2026-11-21T05:00:00Z'),
    event(3, 'b', '2026-11-21T17:00:00Z'),
    event(4, 'c', '2026-11-20T23:00:00Z'),
    event(5, 'd', '2026-11-21T11:00:00Z'),
  ], new Date('2026-11-21T20:00:00Z'), 'Europe/Rome');
  assert.deepEqual(stats.periods.map(p => p.count), [1, 1, 1, 1]);
  assert.equal(stats.continuity.currentStreak, 1);
});

test('handles an empty history without fictitious records or active streaks', () => {
  const stats = completionStats([], new Date('2026-11-21T10:00:00Z'), 'UTC');
  assert.deepEqual(stats.records, { day: null, week: null });
  assert.deepEqual(stats.continuity, { activeDays: 0, currentStreak: 0, longestStreak: 0 });
  assert.equal(stats.firstActivityDate, null);
  assert.ok(stats.periods.every(p => p.count === 0));
});


test('breaks the current streak after a full inactive day', () => {
  const stats = completionStats([event(1, 'a', '2026-11-19T10:00:00Z')], new Date('2026-11-21T09:00:00Z'), 'UTC');
  assert.equal(stats.continuity.currentStreak, 0);
  assert.equal(stats.continuity.longestStreak, 1);
});
