import Link from "next/link";
import LinkedInIcon from "@/components/LinkedInIcon";
import PromptTabs from "@/components/PromptTabs";
import ToolNote from "@/components/ToolNote";
import { PROFILE_PHOTO_INTRO, HOW_TO, PROMPT_GROUPS, REFERENCE_NOTE, WALKTHROUGHS } from "@/content/profile-photo";

export default function ProfilePhotoPage() {
  return (
    <div className="wrap">
      <Link href="/tools" className="backlink">→ חזרה לכלים</Link>

      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          כלי עזר לקורס
        </span>
        <h1 style={{ maxWidth: "none" }}>
          פרומפטים <span className="accent">לתמונה ראשית</span>
        </h1>
        <p className="sub">{PROFILE_PHOTO_INTRO}</p>
      </div>

      <div className="card">
        <div className="step-label">איך משתמשים</div>
        <ol className="howto">
          {HOW_TO.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {WALKTHROUGHS.map((w) => (
          <div key={w.tool} className="walkthrough">
            <span className="walk-tool">{w.tool}</span>
            <div className="shots">
              {w.shots.map((s, i) => (
                <figure className="shot" key={i}>
                  <div className="shot-frame">
                    <span className="shot-badge">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.alt} loading="lazy" />
                  </div>
                  <figcaption>{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="step-label" style={{ marginTop: 8 }}>הפרומפטים</div>
      <p className="sub" style={{ marginTop: -4, marginBottom: 14 }}>{REFERENCE_NOTE}</p>
      <PromptTabs groups={PROMPT_GROUPS} />

      <ToolNote />
    </div>
  );
}
