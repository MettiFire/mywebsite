"use client";

import { useState } from "react";

export default function TasksLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/tasks/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { window.location.replace("/tasks"); return; }
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? `Error ${res.status}`);
    } catch (err) {
      setError(`Network error: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  return (
    <div className="tk-login">
      <h1>Tasks</h1>
      <form onSubmit={submit}>
        <input
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
        />
        <button type="submit" disabled={busy || !password.trim()}>
          {busy ? "…" : "Sign in"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
