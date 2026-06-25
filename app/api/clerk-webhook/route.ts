import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { upsertSubscriber, GROUPS } from "@/lib/mailerlite";

export const runtime = "nodejs";

// Clerk fires this on every new course signup (user.created).
// We push the registrant into the MailerLite Course group, which triggers the
// thank-you automation. If they ticked the newsletter box at signup, add that group too.
export async function POST(request: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(request);
  } catch (err) {
    console.error("clerk webhook verify failed:", err);
    return new Response("invalid signature", { status: 400 });
  }

  if (evt.type !== "user.created") {
    return Response.json({ ignored: evt.type });
  }

  const data = evt.data;
  const primary = data.email_addresses?.find(
    (e) => e.id === data.primary_email_address_id
  );
  const email = (primary || data.email_addresses?.[0])?.email_address;
  if (!email) {
    return Response.json({ ok: true, note: "no email on user" });
  }

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
  const meta = (data.unsafe_metadata || {}) as Record<string, unknown>;
  const wantsNewsletter = meta.newsletter === true;

  const groups = [GROUPS.course];
  if (wantsNewsletter) groups.push(GROUPS.newsletter);

  try {
    await upsertSubscriber({ email, name, groups });
  } catch (e) {
    console.error("mailerlite upsert failed:", e);
    return Response.json({ error: String((e as Error).message) }, { status: 500 });
  }

  return Response.json({ ok: true, email, newsletter: wantsNewsletter });
}
