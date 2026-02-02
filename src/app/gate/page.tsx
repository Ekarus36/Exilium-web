"use client";

import { useState } from "react";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const res = await fetch("/gate/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error || "Wrong password");
        setIsPending(false);
      }
    } catch {
      setError("Something went wrong");
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="parchment-card text-center">
          <div className="compass-rose mb-6" />

          <h1
            className="text-2xl mb-1"
            style={{ fontFamily: "'Cinzel', serif", color: "var(--ink-brown)" }}
          >
            Exilium
          </h1>

          <p
            className="mb-6 text-sm"
            style={{
              fontFamily: "'IM Fell English', serif",
              fontStyle: "italic",
              color: "var(--ink-faded)",
            }}
          >
            Speak the word of passage
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              disabled={isPending}
              className="mb-4"
            />

            {error && (
              <p
                className="mb-4 text-sm"
                style={{ color: "var(--vermillion)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full justify-center"
            >
              {isPending ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
