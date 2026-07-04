"use client";

import { useState } from "react";

const ERRORS: Record<string, string> = {
  not_found: "הקוד לא נמצא. שווה לבדוק את ההקלדה.",
  already_redeemed: "הקוד הזה כבר מומש. אם זה לא מסתדר, אפשר לכתוב לי ל-Hanita@octaloom.com.",
  email_mismatch: "הקוד שמור למייל אחר. אפשר לכתוב לי ל-Hanita@octaloom.com ונפתור.",
  "rate limited": "יותר מדי ניסיונות להיום. אפשר לנסות שוב מחר או לכתוב לי.",
};

export default function RedeemForm() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (r.ok) {
      window.location.href = "/";
      return;
    }
    const d = await r.json().catch(() => ({}));
    setErr(ERRORS[d.error] || "משהו השתבש, אפשר לנסות שוב.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="redeem-form">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="LNKD-XXXX"
        autoFocus
        dir="ltr"
        className="redeem-input"
      />
      <button disabled={busy || !code.trim()} className="auth-btn signup">
        {busy ? "בודקת..." : "פתיחת גישה"}
      </button>
      {err && <p className="redeem-err">{err}</p>}
    </form>
  );
}
