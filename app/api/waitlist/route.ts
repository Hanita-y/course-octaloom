import { upsertSubscriber } from "@/lib/mailerlite";
import { checkAndIncrement } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const today = new Date().toISOString().slice(0, 10);
  const { allowed } = checkAndIncrement(`wl:${ip}`, today, 10);
  if (!allowed) return Response.json({ error: "rate limited" }, { status: 429 });

  let email = "";
  try {
    email = String((await request.json())?.email || "").trim();
  } catch {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return Response.json({ error: "invalid email" }, { status: 400 });

  const group = process.env.MAILERLITE_GROUP_WAITLIST;
  if (!group) return Response.json({ error: "waitlist not configured" }, { status: 500 });
  try {
    await upsertSubscriber({ email, groups: [group] });
  } catch (e) {
    console.error("waitlist upsert failed:", e);
    return Response.json({ error: "failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
