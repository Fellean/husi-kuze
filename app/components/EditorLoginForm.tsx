"use client";

import { FormEvent, useState } from "react";

export default function EditorLoginForm({ returnTo }: { returnTo: string }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "locked">(
    "idle",
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, returnTo }),
    });

    if (response.ok) {
      const payload = (await response.json()) as { redirectTo: string };
      window.location.assign(payload.redirectTo);
      return;
    }

    setStatus(response.status === 429 ? "locked" : "error");
    setPassword("");
  }

  return (
    <form className="editorLoginForm" onSubmit={submit}>
      <label htmlFor="editor-password">Heslo k editoru</label>
      <input
        id="editor-password"
        type="password"
        autoComplete="current-password"
        value={password}
        minLength={10}
        maxLength={256}
        required
        autoFocus
        onChange={(event) => setPassword(event.target.value)}
      />
      {status === "error" && (
        <p role="alert">Tohle heslo nesedí.</p>
      )}
      {status === "locked" && (
        <p role="alert">
          Příliš mnoho pokusů. Dej tomu patnáct minut.
        </p>
      )}
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Otevírám editor…" : "Upravit web"}
      </button>
    </form>
  );
}
