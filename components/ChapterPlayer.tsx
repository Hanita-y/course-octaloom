"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { setChapterProgress, markComplete, getProgress } from "@/lib/progress";
import type { Chapter } from "@/lib/chapters";

export default function ChapterPlayer({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone((getProgress()[chapter.id] || 0) >= 95);
  }, [chapter.id]);

  useEffect(() => {
    if (!chapter.vimeoId || !ref.current) return;
    const player = new Player(ref.current);
    const onTime = (d: { percent: number }) => {
      setChapterProgress(chapter.id, d.percent * 100);
      if (d.percent >= 0.95) setDone(true);
    };
    const onEnd = () => {
      markComplete(chapter.id);
      setDone(true);
    };
    player.on("timeupdate", onTime);
    player.on("ended", onEnd);
    return () => {
      player.off("timeupdate", onTime);
      player.off("ended", onEnd);
    };
  }, [chapter.id, chapter.vimeoId]);

  function handleMark() {
    markComplete(chapter.id);
    setDone(true);
  }

  if (!chapter.vimeoId) {
    return (
      <div className="video-soon">
        <span>הסרטון בעריכה · יעלה בקרוב</span>
        <button className={`mark-btn${done ? " done" : ""}`} onClick={handleMark} disabled={done}>
          {done ? "✓ הושלם" : "סמנו כהושלם (לבדיקה)"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="video-frame">
        <iframe
          ref={ref}
          src={`https://player.vimeo.com/video/${chapter.vimeoId}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={chapter.title}
        />
      </div>
      <div className="lesson-actions">
        <button className={`mark-btn${done ? " done" : ""}`} onClick={handleMark} disabled={done}>
          {done ? "✓ הושלם" : "סמנו כהושלם"}
        </button>
      </div>
    </>
  );
}
