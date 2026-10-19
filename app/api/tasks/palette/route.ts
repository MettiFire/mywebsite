import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/tasks-auth";
import { getState, setState } from "@/lib/sync";

// Colori scelti da noi (hex), condivisi tra i dispositivi.
const HEX = /^#[0-9a-f]{6}$/;
const MAX = 24;

async function save(fn: (cur: string[]) => string[]) {
  const next = fn((await getState<string[]>("palette")) ?? []);
  await setState("palette", next);
  return NextResponse.json({ palette: next });
}

export async function POST(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const { color } = await req.json().catch(() => ({}));
  const c = typeof color === "string" ? color.toLowerCase() : "";
  if (!HEX.test(c)) return NextResponse.json({ error: "bad color" }, { status: 400 });
  return save((cur) => [...cur.filter((x) => x !== c), c].slice(-MAX));
}

export async function DELETE(req: NextRequest) {
  const denied = await guard();
  if (denied) return denied;
  const c = (req.nextUrl.searchParams.get("color") ?? "").toLowerCase();
  return save((cur) => cur.filter((x) => x !== c));
}
