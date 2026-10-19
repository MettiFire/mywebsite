import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/tasks-auth";
import { runSync } from "@/lib/sync";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const p = req.nextUrl.searchParams;
  try {
    return NextResponse.json(await runSync({ force: p.get("force") === "1", full: p.get("full") === "1" }));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
