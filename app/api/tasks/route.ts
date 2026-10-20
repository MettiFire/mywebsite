import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase-admin";
import { guard } from "@/lib/tasks-auth";
import { createLocalAndRemote } from "@/lib/tasks-store";
import { getState, type Target } from "@/lib/sync";
import { activeSeries } from "@/lib/series";
import { toView } from "@/lib/tasks-view";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const from = req.nextUrl.searchParams.get("from") ?? "";
  const to = req.nextUrl.searchParams.get("to") ?? "";
  if (!DATE.test(from) || !DATE.test(to)) {
    return NextResponse.json({ error: "from/to must be YYYY-MM-DD" }, { status: 400 });
  }

  const db = admin();
  const [dated, someday, target, series, palette, tweekColors] = await Promise.all([
    db.from("tw_tasks").select("*").is("deleted_at", null).gte("date", from).lte("date", to).order("created_at"),
    db.from("tw_tasks").select("*").is("deleted_at", null).is("date", null).order("created_at"),
    getState<Target>("default_target"),
    activeSeries(),
    getState<string[]>("palette"),
    getState<unknown[]>("tweek_colors"),
  ]);
  const err = dated.error ?? someday.error;
  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({
    tasks: (dated.data ?? []).map((r) => toView(r, series)),
    someday: (someday.data ?? []).map((r) => toView(r, series)),
    lists: target?.lists ?? [],
    palette: palette ?? [],
    tweekColors: tweekColors ?? [],
  });
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const b = await req.json().catch(() => ({}));
  const text = typeof b.text === "string" ? b.text.trim() : "";
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (b.date && !DATE.test(b.date)) return NextResponse.json({ error: "bad date" }, { status: 400 });

  try {
    const task = await createLocalAndRemote({
      text, date: b.date ?? null, someday: !!b.someday, listId: typeof b.listId === "string" ? b.listId : null,
      note: b.note ?? null, color: b.color ?? null,
    });
    return NextResponse.json({ task: toView(task, await activeSeries()) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
