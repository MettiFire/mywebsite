import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase-admin";
import { guard } from "@/lib/tasks-auth";
import { createLocalAndRemote } from "@/lib/tasks-store";

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
  const [dated, someday] = await Promise.all([
    db.from("tw_tasks").select("*").is("deleted_at", null).gte("date", from).lte("date", to).order("created_at"),
    db.from("tw_tasks").select("*").is("deleted_at", null).is("date", null).order("created_at"),
  ]);
  const err = dated.error ?? someday.error;
  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ tasks: dated.data, someday: someday.data });
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
      text, date: b.date ?? null, someday: !!b.someday, note: b.note ?? null, color: b.color ?? null,
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
