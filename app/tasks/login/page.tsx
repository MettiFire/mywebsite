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
    <div className="max-w-sm mx-auto px-6 pt-10">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="rounded border border-neutral-400/50 bg-transparent px-3 py-2 outline-none focus:border-text-primary"
        />
        <button
          type="submit"
          disabled={busy || !password}
          className="rounded border border-neutral-400/50 px-3 py-2 text-sm hover:border-text-primary disabled:opacity-50"
        >
          {busy ? "…" : "entra"}
        </button>
        {error && <p className="text-sm text-text-secondary">{error}</p>}
      </form>
    </div>
  );
}
