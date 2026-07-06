"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Player from "@vimeo/player";
import { setChapterProgress, markComplete, getProgress } from "@/lib/progress";
import { syncVideo } from "@/lib/progress-sync";
import type { Chapter } from "@/lib/chapters";

// Wistia JS API queue (loaded by the player.js script below).
declare global {
  interface Window {
    _wq?: Array<Record<string, unknown>>;
  }
}

export default function ChapterPlayer({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone((getProgress()[chapter.id] || 0) >= 95);
  }, [chapter.id]);

  // Wistia progress tracking via the JS API queue.
  useEffect(() => {
    if (!chapter.wistiaId) return;
    window._wq = window._wq || [];
    const handle = {
      id: chapter.wistiaId,
      onReady(video: { bind: (ev: string, cb: (v: number) => void) => void }) {
        video.bind("percentwatchedchanged", (percent: number) => {
          setChapterProgress(chapter.id, percent * 100);
          syncVideo(chapter.id, percent * 100);
          if (percent >= 0.95) setDone(true);
        });
        video.bind("end", () => {
          markComplete(chapter.id);
          syncVideo(chapter.id, 100, true);
          setDone(true);
        });
      },
    };
    window._wq.push(handle);
    return () => {
      window._wq?.push({ revoke: handle });
    };
  }, [chapter.id, chapter.wistiaId]);

  useEffect(() => {
    if (!chapter.vimeoId || !ref.current) return;
    const player = new Player(ref.current);
    const onTime = (d: { percent: number }) => {
      setChapterProgress(chapter.id, d.percent * 100);
      syncVideo(chapter.id, d.percent * 100);
      if (d.percent >= 0.95) setDone(true);
    };
    const onEnd = () => {
      markComplete(chapter.id);
      syncVideo(chapter.id, 100, true);
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
    syncVideo(chapter.id, 100, true);
    setDone(true);
  }

  if (chapter.wistiaId) {
    return (
      <>
        <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
        <Script
          src={`https://fast.wistia.com/embed/${chapter.wistiaId}.js`}
          type="module"
          strategy="afterInteractive"
        />
        <div className="video-frame">
          {/* @ts-expect-error wistia-player is a custom element */}
          <wistia-player media-id={chapter.wistiaId} aspect="1.7777777777777777" />
        </div>
        <div className="lesson-actions">
          <button className={`mark-btn${done ? " done" : ""}`} onClick={handleMark} disabled={done}>
            {done ? "✓ הושלם" : "סמנו כהושלם"}
          </button>
        </div>
      </>
    );
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
