import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/supabase-admin";
import { guard } from "@/lib/tasks-auth";

export async function GET(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 100), 500);
  const before = req.nextUrl.searchParams.get("before");

  let q = admin().from("tw_task_events").select("*").order("at", { ascending: false }).limit(limit);
  if (before) q = q.lt("at", before);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}
