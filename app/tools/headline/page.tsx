"use client";

import { useState } from "react";
import Link from "next/link";
import { FORMULAS, type Lang } from "@/lib/formulas";
import LinkedInIcon from "@/components/LinkedInIcon";

const FORMULA_META: Record<string, { num: number; icon: string; tag: string }> = {
  objection: { num: 1, icon: "🛡️", tag: "כשיש התנגדות חוזרת" },
  positioning: { num: 2, icon: "✦", tag: "כשיש זווית ייחודית" },
  offer: { num: 3, icon: "🎯", tag: "כשיש תהליך ותוצאה" },
};

export default function HeadlinePage() {
  const [formulaKey, setFormulaKey] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<Lang>("עברית");
  const [variations, setVariations] = useState<string[]>([]);
  const [handoffPrompt, setHandoffPrompt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectFormula(key: string) {
    setFormulaKey(key);
    setAnswers({});
    setVariations([]);
    setHandoffPrompt(null);
    setRemaining(null);
    setError(null);
  }

  async function generate() {
    if (!formulaKey) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula: formulaKey, answers, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "שגיאה");
        return;
      }
      if (data.handoff) {
        setHandoffPrompt(data.prompt);
        setVariations([]);
        return;
      }
      setVariations(data.variations || []);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      if (data.lastFree && data.prompt) setHandoffPrompt(data.prompt);
    } catch (e) {
      setError(String((e as Error)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  const formula = formulaKey ? FORMULAS[formulaKey] : null;

  return (
    <div className="wrap">
      <Link href="/tools" className="backlink">→ חזרה לכלים</Link>

      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          נוסחאות מפרק 2
        </span>
        <h1>
          מחולל כותרות <span className="accent">פרופיל</span>
        </h1>
        <p className="sub">
          הכותרת היא בהכרח הדבר הכי חשוב שיש לנו בפרופיל. מלווה אותנו בכל אינטראקציה בפלטפורמה. בחרו נוסחה וענו על כמה שאלות, וקבלו 5 וריאציות מוכנות לכותרת (הדליין) שלכם.
        </p>
      </div>

      <div className="steps">
        <div className="step"><span className="step-num">1</span> בחרו נוסחה</div>
        <div className="step-arrow">←</div>
        <div className="step"><span className="step-num">2</span> מלאו שאלון</div>
        <div className="step-arrow">←</div>
        <div className="step"><span className="step-num">3</span> קבלו 5 כותרות</div>
      </div>

      <div className="card">
        <div className="step-label">שלב 1 · בחרו נוסחה</div>
        <div className="formula-grid">
          {Object.entries(FORMULAS).map(([key, f]) => {
            const meta = FORMULA_META[key];
            return (
              <div
                key={key}
                className={`formula formula-${key}${formulaKey === key ? " active" : ""}`}
                onClick={() => selectFormula(key)}
              >
                <span className="formula-num">{meta.icon}</span>
                <div className="formula-text">
                  <div className="formula-top">
                    <h3>{f.name}</h3>
                    <span className="formula-tag">{meta.tag}</span>
                  </div>
                  <p>{f.structure}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {formula && (
        <div className="card">
          <div className="step-label">שלב 2 · שאלון</div>
          {formula.fields.map((fld) => (
            <div key={fld.id}>
              <label>{fld.label}</label>
              <input
                type="text"
                placeholder={fld.ph}
                value={answers[fld.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [fld.id]: e.target.value })}
              />
            </div>
          ))}
          <label>שפת הכותרת</label>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            <option value="עברית">עברית</option>
            <option value="אנגלית">אנגלית</option>
          </select>
          <div style={{ marginTop: 18 }} />
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? <>מייצרים<span className="spin" /></> : "ייצרו כותרות"}
          </button>
          {remaining !== null && (
            <div className="counter">
              נותרו {remaining} ייצורים היום{remaining <= 0 ? " · בפעם הבאה נציג לך את הפרומפט" : ""}
            </div>
          )}
          {error && <div className="err">שגיאה: {error}</div>}
        </div>
      )}

      {variations.length > 0 && (
        <div className="card">
          <div className="step-label">שלב 3 · התוצאות</div>
          <div className="legend">
            הקו מתחת ל-<b>50 התווים הראשונים</b> = מה שנראה במובייל. שם צריך להיות הפאנץ&apos;.
          </div>
          <div className="results">
            {variations.map((v, i) => {
              const n = v.length;
              const cls = n <= 220 ? "ok" : "over";
              return (
                <div className="variation" key={i}>
                  <div className="txt">
                    <span className="first50">{v.slice(0, 50)}</span>
                    <span className="rest">{v.slice(50)}</span>
                  </div>
                  <span className={`chars ${cls}`}>{n}/220</span>
                  <button className="copy" onClick={() => navigator.clipboard.writeText(v)}>
                    העתיקו
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {handoffPrompt && (
        <div className="card">
          <div className="handoff">
            <h3>הגעת ל-3 ייצורים 🎯</h3>
            <p>העתיקו את הפרומפט המלא ל-ChatGPT / Claude / Gemini שלכם, והמשיכו לשחק איתו שם בלי הגבלה:</p>
            <textarea readOnly value={handoffPrompt} />
            <div style={{ marginTop: 8 }}>
              <button className="copy" onClick={() => navigator.clipboard.writeText(handoffPrompt)}>
                העתקת הפרומפט
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
