"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { getProgress, overallPercent, completedCount, type ProgressMap } from "@/lib/progress";

export default function ChapterList() {
  const [p, setP] = useState<ProgressMap>({});

  useEffect(() => {
    const load = () => setP(getProgress());
    load();
    window.addEventListener("octa-progress", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("octa-progress", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const overall = overallPercent(p);
  const done = completedCount(p);

  return (
    <>
      <div className="course-progress">
        <div className="cp-head">
          <span>ההתקדמות שלכם בקורס</span>
          <span className="cp-pct">{overall}%</span>
        </div>
        <div className="cp-bar">
          <div className="cp-fill" style={{ width: `${overall}%` }} />
        </div>
        <div className="cp-meta">
          {done === CHAPTERS.length
            ? "סיימתם את כל הקורס 🎉"
            : `${done} מתוך ${CHAPTERS.length} פרקים הושלמו · נשארו ${CHAPTERS.length - done}`}
        </div>
      </div>

      <div className="chapters">
        {CHAPTERS.map((ch, i) => {
          const pct = Math.min(100, p[ch.id] || 0);
          const complete = pct >= 95;
          return (
            <Link
              key={ch.id}
              href={`/course/${ch.id}`}
              className="chapter"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className={`chapter-label${complete ? " done" : ""}`}>
                {complete ? "✓" : ch.label}
              </span>
              <div className="chapter-body">
                <h3>{ch.title}</h3>
                <p>{ch.desc}</p>
                {pct > 0 && (
                  <div className="ch-bar">
                    <div className="ch-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <div className="chapter-meta">
                <span className="dur">{pct > 0 ? (complete ? "הושלם" : `${pct}%`) : ch.duration}</span>
                <span className="arrow">←</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
