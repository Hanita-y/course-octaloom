// Client-side, fire-and-forget sync to /api/progress.
// Video is throttled to 10% buckets so the player's frequent events don't spam
// the server; tool pings fire once per mount.

const sentBucket = new Map<string, number>();

function post(body: unknown) {
  fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

export function syncVideo(chapterId: string, percent: number, force = false) {
  const bucket = Math.floor(Math.min(100, Math.max(0, percent)) / 10);
  if (!force && sentBucket.get(chapterId) === bucket) return;
  sentBucket.set(chapterId, bucket);
  post({ type: "video", chapterId, percent: Math.round(percent) });
}

export function syncTool(toolId: string) {
  post({ type: "tool", toolId });
}
