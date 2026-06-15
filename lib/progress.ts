import { CHAPTERS } from "./chapters";

// Per-user course progress, stored in localStorage (no backend needed for v1).
const KEY = "octa-course-progress";

export type ProgressMap = Record<string, number>; // chapterId -> percent watched (0..100)

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

// Progress only ever goes up (monotonic max), so seeking back doesn't lower it.
export function setChapterProgress(id: string, percent: number) {
  if (typeof window === "undefined") return;
  const p = getProgress();
  const cur = p[id] || 0;
  const next = Math.min(100, Math.max(cur, Math.round(percent)));
  if (next === cur) return;
  p[id] = next;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("octa-progress"));
}

export function markComplete(id: string) {
  setChapterProgress(id, 100);
}

export function overallPercent(p: ProgressMap): number {
  if (!CHAPTERS.length) return 0;
  const sum = CHAPTERS.reduce((a, c) => a + Math.min(100, p[c.id] || 0), 0);
  return Math.round(sum / CHAPTERS.length);
}

export function completedCount(p: ProgressMap): number {
  return CHAPTERS.filter((c) => (p[c.id] || 0) >= 95).length;
}
