// Pura Web Crypto: usabile sia in proxy.ts sia nei route handlers.
export const COOKIE_NAME = "tasks_session";
const MAX_AGE_MS = 30 * 24 * 3600 * 1000;
export const SESSION_MAX_AGE_S = MAX_AGE_MS / 1000;
const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.TASKS_SESSION_SECRET;
  if (!secret) throw new Error("TASKS_SESSION_SECRET mancante");
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function makeSession() {
  const exp = String(Date.now() + MAX_AGE_MS);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifySessionEdge(value?: string) {
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp));
}
