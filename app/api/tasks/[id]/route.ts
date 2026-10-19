import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/tasks-auth";
import { admin } from "@/lib/supabase-admin";
import { activeSeries, isFreq, propagate, setRepeat } from "@/lib/series";
import { deleteLocalAndRemote, updateLocalAndRemote } from "@/lib/tasks-store";
import { toView } from "@/lib/tasks-view";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED = ["text", "done", "date", "listId", "note", "color", "checklist", "sort"] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  for (const k of ALLOWED) if (k in b) patch[k] = b[k];
  const repeat = "repeat" in b ? b.repeat : undefined;
  if (repeat !== undefined && repeat !== null && !isFreq(repeat)) {
    return NextResponse.json({ error: "bad repeat" }, { status: 400 });
  }
  if (!Object.keys(patch).length && repeat === undefined) return NextResponse.json({ error: "empty patch" }, { status: 400 });
  if (typeof patch.date === "string" && !DATE.test(patch.date)) {
    return NextResponse.json({ error: "bad date" }, { status: 400 });
  }
  if ("sort" in patch && !Number.isFinite(patch.sort)) {
    return NextResponse.json({ error: "bad sort" }, { status: 400 });
  }
  if ("checklist" in patch && patch.checklist !== null && !Array.isArray(patch.checklist)) {
    return NextResponse.json({ error: "bad checklist" }, { status: 400 });
  }

  try {
    if (Object.keys(patch).length) {
      await updateLocalAndRemote(id, patch);
      await propagate(id, patch);
    }
    if (repeat !== undefined) await setRepeat(id, repeat);
    const { data } = await admin().from("tw_tasks").select("*").eq("id", id).single();
    return NextResponse.json({ task: data && toView(data, await activeSeries()) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  try {
    await deleteLocalAndRemote(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
