// Per-user daily cap on AI generations (the "3 then hand over the prompt" mechanic).
// In-memory store: good enough for a small course. NOTE: on Vercel this resets per
// serverless instance / cold start, so the cap is a soft limit. Upgrade to Vercel KV
// or Clerk privateMetadata if a hard cross-instance cap is needed.

export const MAX_GEN = 3;

interface Record_ {
  date: string;
  count: number;
}

const store = new Map<string, Record_>();

export interface RateResult {
  allowed: boolean;
  count: number;
}

// Returns allowed=false once the user has already used `max` today (default MAX_GEN).
export function checkAndIncrement(userId: string, today: string, max: number = MAX_GEN): RateResult {
  const rec = store.get(userId);
  if (!rec || rec.date !== today) {
    store.set(userId, { date: today, count: 1 });
    return { allowed: true, count: 1 };
  }
  if (rec.count >= max) {
    return { allowed: false, count: rec.count };
  }
  rec.count += 1;
  return { allowed: true, count: rec.count };
}
