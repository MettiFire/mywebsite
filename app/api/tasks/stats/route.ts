import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/tasks-auth";
import { admin } from "@/lib/supabase-admin";
import { completionStats, type CompletionEvent } from "@/lib/tasks-stats";

export async function GET(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const timeZone = req.nextUrl.searchParams.get("timeZone") ?? "UTC";
  try { new Intl.DateTimeFormat("en", { timeZone }).format(); }
  catch { return NextResponse.json({ error: "Invalid time zone" }, { status: 400 }); }

  try {
    const db = admin();
    const now = new Date();
    const { count, error } = await db.from("tw_tasks")
      .select("id", { count: "exact", head: true }).eq("done", true).is("deleted_at", null);
    if (error) throw error;
    const events: CompletionEvent[] = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await db.from("tw_task_events")
        .select("id,task_id,tweek_id,at").eq("type", "completed").eq("source", "local")
        .lte("at", now.toISOString()).order("id").range(offset, offset + pageSize - 1);
      if (error) throw error;
      events.push(...data);
      if (data.length < pageSize) break;
    }
    return NextResponse.json({ completed: count ?? 0, ...completionStats(events, now, timeZone) },
      { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not load statistics. Please try again." }, { status: 500 });
  }
}
