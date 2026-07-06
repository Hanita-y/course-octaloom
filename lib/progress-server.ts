import { getKv } from "@/lib/kv";

// Per-user course activity, stored server-side in Redis so Hanita can see who
// progressed where. Keyed by Clerk userId; email/name are denormalized in for
// the admin view. Video percent is monotonic (max); tool usage is a counter.

export type ToolUse = { count: number; lastAt: string };

export type UserProgress = {
  userId: string;
  email: string;
  name?: string;
  videos: Record<string, number>; // chapterId -> percent (0..100)
  tools: Record<string, ToolUse>; // toolId -> usage
  updatedAt: string;
};

const USERS = "progress:users";
const key = (userId: string) => `progress:${userId}`;

function empty(userId: string, email: string, name?: string): UserProgress {
  return { userId, email, name, videos: {}, tools: {}, updatedAt: new Date().toISOString() };
}

async function read(userId: string): Promise<UserProgress | null> {
  return (await getKv().get(key(userId))) as UserProgress | null;
}

export async function recordVideo(
  user: { id: string; email: string; name?: string },
  chapterId: string,
  percent: number
) {
  const kv = getKv();
  const rec = (await read(user.id)) || empty(user.id, user.email, user.name);
  rec.email = user.email;
  if (user.name) rec.name = user.name;
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  rec.videos[chapterId] = Math.max(rec.videos[chapterId] || 0, clamped);
  rec.updatedAt = new Date().toISOString();
  await kv.set(key(user.id), rec);
  await kv.sadd(USERS, user.id);
}

export async function recordTool(
  user: { id: string; email: string; name?: string },
  toolId: string
) {
  const kv = getKv();
  const rec = (await read(user.id)) || empty(user.id, user.email, user.name);
  rec.email = user.email;
  if (user.name) rec.name = user.name;
  const prev = rec.tools[toolId];
  rec.tools[toolId] = { count: (prev?.count || 0) + 1, lastAt: new Date().toISOString() };
  rec.updatedAt = new Date().toISOString();
  await kv.set(key(user.id), rec);
  await kv.sadd(USERS, user.id);
}

export async function listAllProgress(): Promise<UserProgress[]> {
  const kv = getKv();
  const ids = (await kv.smembers(USERS)) as string[];
  const all = await Promise.all(ids.map((id) => read(id)));
  return all
    .filter((x): x is UserProgress => !!x)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
