import { NextRequest, NextResponse } from "next/server";
import { runSync } from "@/lib/sync";
import { safeEqual } from "@/lib/tasks-session";

export const maxDuration = 60;

// Vercel invia "Authorization: Bearer $CRON_SECRET" se CRON_SECRET è definita.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const got = req.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(got, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await runSync({ force: true }));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
