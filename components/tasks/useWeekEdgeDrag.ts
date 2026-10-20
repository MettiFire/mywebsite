"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BeforeCapture, DropResult, FluidDragActions, SensorAPI } from "@hello-pangea/dnd";

export const WEEK_EDGE_LEFT = "week-edge:left";
export const WEEK_EDGE_RIGHT = "week-edge:right";
const EDGE_WIDTH = 40;
const DWELL_MS = 1000;
type Direction = -1 | 1;
type Point = { x: number; y: number };
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const rowFor = (id: string) => [...document.querySelectorAll<HTMLElement>("[data-task-id]")]
  .find((row) => row.dataset.taskId === id);

// A week change removes the original draggable. Release its sensor, keep a
// temporary visual under the pointer, then acquire the task in the new week.
export function useWeekEdgeDrag(options: {
  canShift: (id: string) => boolean;
  shift: (id: string, direction: Direction) => Promise<void>;
  finish: () => void;
  onError: (message: string) => void;
}) {
  const latest = useRef(options);
  useEffect(() => { latest.current = options; });
  const apiRef = useRef<SensorAPI | null>(null);
  const runtime = useRef({
    id: null as string | null,
    pointer: { x: 0, y: 0 } as Point,
    mouse: false,
    down: false,
    transferring: false,
    zone: null as Direction | null,
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
    manual: null as FluidDragActions | null,
    move: null as ((point: Point) => void) | null,
    ghost: null as HTMLElement | null,
  });
  const [enabled, setEnabled] = useState(false);
  const [edge, setEdge] = useState<Direction | null>(null);
  const [band, setBand] = useState({ top: 0, height: 0 });

  const sensor = useCallback((api: SensorAPI) => { apiRef.current = api; }, []);
  const clearTimer = useCallback(() => {
    clearTimeout(runtime.current.timer);
    runtime.current.timer = undefined;
    runtime.current.zone = null;
  }, []);
  const stop = useCallback(() => {
    clearTimer();
    const state = runtime.current;
    state.id = null;
    state.manual = null;
    state.move = null;
    state.ghost?.remove();
    state.ghost = null;
    setEnabled(false);
    setEdge(null);
  }, [clearTimer]);

  useEffect(() => {
    const state = runtime.current;
    let alive = true;
    const updateZone = () => {
      const bounds = document.querySelector(".tk-week")?.getBoundingClientRect();
      if (state.id && bounds) setBand((current) => current.top === bounds.top && current.height === bounds.height ? current : { top: bounds.top, height: bounds.height });
      const p = state.pointer;
      const zone: Direction | null = state.id && state.down && bounds && p.y >= bounds.top && p.y <= bounds.bottom
        ? p.x <= EDGE_WIDTH ? -1 : p.x >= document.documentElement.clientWidth - EDGE_WIDTH ? 1 : null
        : null;
      if (state.transferring || zone === state.zone) return;
      clearTimer();
      state.zone = zone;
      setEdge(zone);
      if (zone) state.timer = setTimeout(() => { void transfer(zone); }, DWELL_MS);
    };
    const transfer = async (direction: Direction) => {
      const id = state.id;
      const api = apiRef.current;
      if (!id || !api || !state.down || state.transferring) return;
      clearTimer();
      state.transferring = true;
      const row = rowFor(id);
      const rect = row?.getBoundingClientRect();
      const grab = rect ? { x: rect.left + rect.width / 2 - state.pointer.x, y: rect.top + rect.height / 2 - state.pointer.y } : { x: 0, y: 0 };
      if (row && rect) {
        const ghost = row.cloneNode(true) as HTMLElement;
        for (const element of [ghost, ...ghost.querySelectorAll("*")]) {
          for (const attribute of [...element.attributes]) {
            if (attribute.name.startsWith("data-rfd") || attribute.name === "data-task-id" || attribute.name === "id") element.removeAttribute(attribute.name);
          }
        }
        ghost.dataset.lastX = String(state.pointer.x);
        ghost.dataset.lastY = String(state.pointer.y);
        ghost.setAttribute("aria-hidden", "true");
        ghost.classList.add("tk-transfer-ghost");
        Object.assign(ghost.style, { position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, transform: "none", transition: "none", pointerEvents: "none", zIndex: "1000" });
        document.body.appendChild(ghost);
        state.ghost = ghost;
      }
      state.manual = null;
      state.move = null;
      // This produces an internal CANCEL, suppressed by onDragEnd below.
      try {
        api.tryReleaseLock();
        await latest.current.shift(id, direction);
        for (let attempt = 0; alive && state.down && attempt < 60; attempt++) {
          await frame();
          const target = rowFor(id);
          if (!target || !api.canGetLock(id)) continue;
          const box = target.getBoundingClientRect();
          const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
          const lock = api.tryGetLock(id, () => { state.manual = null; state.move = null; });
          if (!lock) continue;
          const actions = lock.fluidLift(center);
          state.manual = actions;
          state.move = (point) => actions.move({ x: point.x + grab.x, y: point.y + grab.y });
          state.move(state.pointer);
          await frame();
          await frame();
          break;
        }
      } catch (error) {
        latest.current.onError(`Week move failed: ${(error as Error).message}`);
      } finally {
        state.transferring = false;
        state.ghost?.remove();
        state.ghost = null;
        if (!alive) return;
        if (!state.down || !state.manual) {
          stop();
          latest.current.finish();
        } else updateZone();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      state.mouse = event.pointerType === "mouse";
      state.down = event.button === 0;
      state.pointer = { x: event.clientX, y: event.clientY };
    };
    const onMove = (event: MouseEvent) => {
      state.pointer = { x: event.clientX, y: event.clientY };
      const ghost = state.ghost;
      if (ghost) {
        // Keep the same grab offset while React replaces the week.
        const x = Number(ghost.dataset.lastX ?? event.clientX);
        const y = Number(ghost.dataset.lastY ?? event.clientY);
        ghost.style.left = `${parseFloat(ghost.style.left) + event.clientX - x}px`;
        ghost.style.top = `${parseFloat(ghost.style.top) + event.clientY - y}px`;
        ghost.dataset.lastX = String(event.clientX);
        ghost.dataset.lastY = String(event.clientY);
      }
      state.move?.(state.pointer);
      updateZone();
    };
    const onUp = () => {
      state.down = false;
      clearTimer();
      if (!state.transferring && state.manual?.isActive()) state.manual.drop({ shouldBlockNextClick: true });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      state.down = false;
      clearTimer();
      if (state.manual?.isActive()) state.manual.cancel({ shouldBlockNextClick: true });
    };
    const onBlur = () => {
      state.down = false;
      clearTimer();
      if (state.manual?.isActive()) state.manual.cancel({ shouldBlockNextClick: true });
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("mouseup", onUp, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("blur", onBlur);
    return () => {
      alive = false;
      clearTimer();
      state.ghost?.remove();
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("mouseup", onUp, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("blur", onBlur);
    };
  }, [clearTimer, stop]);

  const onDragStart = useCallback((start: BeforeCapture) => {
    const state = runtime.current;
    if (state.transferring) return;
    if (start.mode !== "FLUID" || !state.mouse || !latest.current.canShift(start.draggableId)) return;
    state.id = start.draggableId;
    const bounds = document.querySelector(".tk-week")?.getBoundingClientRect();
    if (bounds) setBand({ top: bounds.top, height: bounds.height });
    setEnabled(true);
  }, []);
  const onDragEnd = useCallback((result: DropResult) => {
    if (runtime.current.transferring) return true;
    const direction = result.destination?.droppableId === WEEK_EDGE_LEFT ? -1
      : result.destination?.droppableId === WEEK_EDGE_RIGHT ? 1 : null;
    const id = runtime.current.id;
    stop();
    if (direction && id && result.reason === "DROP") {
      void latest.current.shift(id, direction).catch((error: Error) => latest.current.onError(error.message)).finally(() => latest.current.finish());
      return true;
    }
    return false;
  }, [stop]);
  return { sensor, enabled, edge, band, onDragStart, onDragEnd };
}
