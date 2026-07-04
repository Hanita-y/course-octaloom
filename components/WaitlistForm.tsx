"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"" | "busy" | "done" | "err">("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const r = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(r.ok ? "done" : "err");
  }

  if (state === "done") return <p className="wl-done">✓ קיבלתי. נשלח מייל ברגע שהקורס נפתח 💜</p>;
  return (
    <form onSubmit={submit} className="redeem-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="המייל שלך"
        dir="ltr"
        className="redeem-input"
      />
      <button disabled={state === "busy"} className="auth-btn signup">
        {state === "busy" ? "רגע..." : "עדכנו אותי כשנפתח"}
      </button>
      {state === "err" && <p className="redeem-err">משהו השתבש, אפשר לנסות שוב.</p>}
    </form>
  );
}
