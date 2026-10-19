import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionEdge } from "@/lib/tasks-session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/tasks/login" || pathname === "/api/tasks/auth") return NextResponse.next();

  if (await verifySessionEdge(req.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/tasks/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/tasks/:path*", "/api/tasks/:path*"] };
