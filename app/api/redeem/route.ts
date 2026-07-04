import { auth, clerkClient } from "@clerk/nextjs/server";
import { getKv } from "@/lib/kv";
import { redeemCode } from "@/lib/codes";
import { checkAndIncrement } from "@/lib/ratelimit";
import { upsertSubscriber, GROUPS } from "@/lib/mailerlite";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  // Rate limit redeem attempts (daily counter per user, same mechanism as the tools).
  const today = new Date().toISOString().slice(0, 10);
  const { allowed } = checkAndIncrement(`redeem:${userId}`, today, 10);
  if (!allowed) return Response.json({ error: "rate limited" }, { status: 429 });

  let code = "";
  try {
    code = String((await request.json())?.code || "");
  } catch {}
  if (!code) return Response.json({ error: "missing code" }, { status: 400 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress || "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const result = await redeemCode(getKv(), code, { id: userId, email });
  if (!result.ok) return Response.json({ error: result.reason }, { status: 400 });

  await client.users.updateUser(userId, {
    publicMetadata: { ...user.publicMetadata, courseAccess: true },
  });

  // Joining the course group fires the MailerLite welcome sequence.
  try {
    await upsertSubscriber({ email, name, groups: [GROUPS.course] });
  } catch (e) {
    console.error("mailerlite after redeem failed:", e);
  }

  return Response.json({ ok: true });
}
