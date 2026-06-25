import { auth, clerkClient } from "@clerk/nextjs/server";
import { upsertSubscriber, GROUPS } from "@/lib/mailerlite";

export const runtime = "nodejs";

// Backs the in-app newsletter card shown once after first login.
// action "subscribe" -> add to Newsletter group + remember they opted in.
// action "dismiss"   -> just remember we asked, so the card never nags again.
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let action = "subscribe";
  try {
    const body = await request.json();
    if (body?.action === "dismiss") action = "dismiss";
  } catch {
    // empty body -> default to subscribe
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  try {
    if (action === "subscribe") {
      if (!email) {
        return Response.json({ error: "no email on user" }, { status: 400 });
      }
      await upsertSubscriber({ email, name, groups: [GROUPS.newsletter] });
    }
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        newsletterPrompted: true,
        newsletter: action === "subscribe" ? true : user.publicMetadata?.newsletter ?? false,
      },
    });
  } catch (e) {
    console.error("newsletter action failed:", e);
    return Response.json({ error: String((e as Error).message) }, { status: 500 });
  }

  return Response.json({ ok: true, action });
}
