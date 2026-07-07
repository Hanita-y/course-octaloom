"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { getProgress, overallPercent, completedCount, type ProgressMap } from "@/lib/progress";

export default function HeroProgress() {
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
  const nextIdx = CHAPTERS.findIndex((c) => Math.min(100, p[c.id] || 0) < 95);
  const next = nextIdx === -1 ? null : CHAPTERS[nextIdx];

  return (
    <div className="hp">
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: `${overall}%` }} />
      </div>
      <div className="hp-row">
        {next ? (
          <Link href={`/course/${next.id}`} className="hp-cta">
            {overall > 0 ? `להמשיך · ${next.label}` : `להתחיל · ${next.label}`} ←
          </Link>
        ) : (
          <span className="hp-done">סיימתם את כל הקורס 🎉</span>
        )}
        <span className="hp-pct">{overall}%</span>
      </div>
      <div className="hp-meta">
        {done === CHAPTERS.length
          ? "כל הפרקים הושלמו"
          : `${done} מתוך ${CHAPTERS.length} פרקים הושלמו`}
      </div>
    </div>
  );
}
