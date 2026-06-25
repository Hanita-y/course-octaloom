import Link from "next/link";
import LinkedInIcon from "@/components/LinkedInIcon";
import PromptCard from "@/components/PromptCard";
import ToolNote from "@/components/ToolNote";
import { ABOUT_INTRO, ABOUT_PROMPT } from "@/content/about";

export default function AboutPage() {
  return (
    <div className="wrap">
      <Link href="/tools" className="backlink">→ חזרה לכלים</Link>

      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          כלי עזר לקורס
        </span>
        <h1 style={{ maxWidth: "none" }}>
          כתיבת אודות <span className="accent">(About)</span>
        </h1>
      </div>

      <div className="card">
        <p className="lead">{ABOUT_INTRO}</p>
      </div>

      <PromptCard
        title="הפרומפט"
        tag="בונה איתך את ה-About שלב אחרי שלב, ומסיים בגרסה מוכנה להעתקה"
        body={ABOUT_PROMPT}
      />

      <ToolNote />
    </div>
  );
}
