import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_MAX_AGE_S, makeSession, safeEqual } from "@/lib/tasks-session";

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.TASKS_PASSWORD?.trim();
  // Messaggi distinti: prima ogni errore del server appariva come "password errata".
  if (!expected) return NextResponse.json({ error: "Server misconfigured: TASKS_PASSWORD is not set" }, { status: 500 });
  if (!process.env.TASKS_SESSION_SECRET) {
    return NextResponse.json({ error: "Server misconfigured: TASKS_SESSION_SECRET is not set" }, { status: 500 });
  }

  // trim: tastiere mobile e password manager aggiungono spesso uno spazio finale
  const given = typeof password === "string" ? password.trim() : "";
  if (!given || !safeEqual(given, expected)) {
    await new Promise((r) => setTimeout(r, 1200)); // rallenta il brute force
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await makeSession(), {
    httpOnly: true,
    // Safari rifiuta i cookie Secure su http://localhost: lo uso solo quando la richiesta è davvero https
    secure: req.nextUrl.protocol === "https:" || process.env.VERCEL === "1",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
