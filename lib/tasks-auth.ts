import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionEdge } from "@/lib/tasks-session";

// Difesa in profondità: ogni route handler ricontrolla la sessione,
// oltre al controllo già fatto in proxy.ts.
export async function guard(): Promise<Response | null> {
  const ok = await verifySessionEdge((await cookies()).get(COOKIE_NAME)?.value);
  return ok ? null : Response.json({ error: "unauthorized" }, { status: 401 });
}
