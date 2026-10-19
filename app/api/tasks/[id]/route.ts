import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/tasks-auth";
import { deleteLocalAndRemote, updateLocalAndRemote } from "@/lib/tasks-store";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED = ["text", "done", "date", "listId", "note", "color", "checklist"] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  for (const k of ALLOWED) if (k in b) patch[k] = b[k];
  if (!Object.keys(patch).length) return NextResponse.json({ error: "empty patch" }, { status: 400 });
  if (typeof patch.date === "string" && !DATE.test(patch.date)) {
    return NextResponse.json({ error: "bad date" }, { status: 400 });
  }
  if ("checklist" in patch && patch.checklist !== null && !Array.isArray(patch.checklist)) {
    return NextResponse.json({ error: "bad checklist" }, { status: 400 });
  }

  try {
    return NextResponse.json({ task: await updateLocalAndRemote(id, patch) });
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
