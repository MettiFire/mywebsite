import type { Task } from "./types";

export const sortKey = (task: Task) =>
  task.sort ?? (Date.parse(task.created_at ?? "") || Number.MAX_SAFE_INTEGER);

export const byOrder = (a: Task, b: Task) =>
  Number(!!a.pending) - Number(!!b.pending) || sortKey(a) - sortKey(b) ||
  (a.created_at ?? "").localeCompare(b.created_at ?? "") || a.id.localeCompare(b.id);

// Normally only the moved task needs saving. Rebalance when equal or very close
// ranks leave no representable position between the two neighbours.
export function insertionOrder(tasks: Task[], movedId: string, index: number) {
  const others = tasks.filter((task) => task.id !== movedId);
  const position = Math.max(0, Math.min(index, others.length));
  const previous = others[position - 1];
  const next = others[position];
  const rank = previous && next ? sortKey(previous) + (sortKey(next) - sortKey(previous)) / 2
    : previous ? sortKey(previous) + 1024
    : next ? sortKey(next) - 1024
    : 0;
  if (Number.isFinite(rank) && (!previous || rank > sortKey(previous)) && (!next || rank < sortKey(next))) {
    return [{ id: movedId, sort: rank }];
  }
  const ids = others.map((task) => task.id);
  ids.splice(position, 0, movedId);
  return ids.map((id, i) => ({ id, sort: i * 1024 }));
}
