"use client";

import { useEffect, useState } from "react";

type Code = {
  code: string;
  status: string;
  note?: string;
  lockedEmail?: string;
  createdAt: string;
  redeemedByEmail?: string;
  redeemedAt?: string;
};

export default function AdminCodes() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [lockedEmail, setLockedEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  async function load() {
    const r = await fetch("/api/admin/codes");
    if (r.ok) setCodes((await r.json()).codes);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count, note, lockedEmail }),
    });
    setNote("");
    setLockedEmail("");
    setCount(1);
    setBusy(false);
    load();
  }

  function copy(c: string) {
    navigator.clipboard.writeText(c);
    setCopied(c);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="admin-codes">
      <form onSubmit={create} className="admin-form">
        <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(+e.target.value)} title="כמות" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="הערה (למי הקוד)" />
        <input value={lockedEmail} onChange={(e) => setLockedEmail(e.target.value)} placeholder="נעילה למייל (רשות)" dir="ltr" />
        <button disabled={busy} className="auth-btn signup">{busy ? "יוצרת..." : "צרי קוד"}</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr><th>קוד</th><th>סטטוס</th><th>הערה</th><th>מומש ע״י</th><th>נוצר</th></tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.code}>
              <td dir="ltr">
                <button className="code-copy" onClick={() => copy(c.code)}>
                  {c.code} {copied === c.code ? "✓" : "⧉"}
                </button>
              </td>
              <td>{c.status === "active" ? "פנוי" : "מומש"}</td>
              <td>{c.note || ""}{c.lockedEmail ? ` · 🔒 ${c.lockedEmail}` : ""}</td>
              <td dir="ltr">{c.redeemedByEmail || ""}</td>
              <td>{new Date(c.createdAt).toLocaleDateString("he-IL")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
