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
    const res = await fetch("/api/tasks/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/tasks";
    } else {
      setError("Password errata");
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 pt-32">
      <h1 className="text-4xl font-bold tracking-[-1px] mb-8">Tasks</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-12 rounded-full bg-black/5 dark:bg-white/10 px-5 outline-none focus:ring-2 focus:ring-ink"
        />
        <button
          type="submit"
          disabled={busy || !password}
          className="h-12 rounded-full bg-ink text-paper font-bold transition active:scale-[.98] disabled:opacity-40"
        >
          {busy ? "…" : "Entra"}
        </button>
        {error && <p className="text-sm text-center text-muted">{error}</p>}
      </form>
    </div>
  );
}
