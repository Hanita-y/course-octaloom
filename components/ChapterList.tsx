"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { getProgress, type ProgressMap } from "@/lib/progress";

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

  return (
    <>
      <div className="index-head">
        <h2>תוכן הקורס</h2>
        <span>{CHAPTERS.length} פרקים</span>
      </div>

      <div className="chapters">
        {CHAPTERS.map((ch, i) => {
          const pct = Math.min(100, p[ch.id] || 0);
          const complete = pct >= 95;
          const current = i === CHAPTERS.findIndex((c) => Math.min(100, p[c.id] || 0) < 95);
          return (
            <Link
              key={ch.id}
              href={`/course/${ch.id}`}
              className={`chapter${complete ? " done" : ""}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <span className="ch-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="chapter-body">
                <h3>{ch.title}</h3>
                <p>{ch.desc}</p>
                {pct > 0 && !complete && (
                  <div className="ch-bar">
                    <div className="ch-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <div className="chapter-meta">
                <span className="ch-label">{ch.label} · {ch.duration}</span>
                {complete ? (
                  <span className="ch-state done">✓ הושלם</span>
                ) : current ? (
                  <span className="ch-state now">{pct > 0 ? `${pct}%` : "הפרק הבא"}</span>
                ) : pct > 0 ? (
                  <span className="ch-state part">{pct}%</span>
                ) : (
                  <span className="arrow">←</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
