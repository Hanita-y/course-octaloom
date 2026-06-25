import Link from "next/link";
import LinkedInIcon from "@/components/LinkedInIcon";
import PromptCard from "@/components/PromptCard";
import ToolNote from "@/components/ToolNote";
import { COVER_INTRO, COVER_PROMPT, QUICK_GUIDE, EXAMPLE_SLOTS } from "@/content/cover-text";

export default function CoverTextPage() {
  return (
    <div className="wrap">
      <Link href="/tools" className="backlink">→ חזרה לכלים</Link>

      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          כלי עזר לקורס
        </span>
        <h1 style={{ maxWidth: "none" }}>
          טקסט ל<span className="accent">באנר</span>
        </h1>
        <p className="sub" style={{ maxWidth: "60ch" }}>{COVER_INTRO}</p>
      </div>

      <PromptCard
        title="הפרומפט"
        tag="בונה איתך טקסט, פריסה, ופרומפט תמונה מוכן לכלי AI"
        body={COVER_PROMPT}
      />

      <div className="card">
        <div className="step-label">מדריך מהיר · קווים מנחים לקאבר מקצועי</div>
        <ul className="guide-list">
          {QUICK_GUIDE.map((g, i) => (
            <li key={i}>
              <b>{g.label}:</b> {g.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="step-label" style={{ marginTop: 8 }}>דוגמאות לבאנרים שעובדים</div>
      {EXAMPLE_SLOTS.map((slot, i) => (
        <div className="card" key={i}>
          <h3 className="prompt-title" style={{ marginBottom: 12 }}>{slot.title}</h3>
          <div className="shot-placeholder">{slot.note}</div>
        </div>
      ))}

      <ToolNote />
    </div>
  );
}
