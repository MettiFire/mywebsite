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
const { completionActivity } = compiled.exports;
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
