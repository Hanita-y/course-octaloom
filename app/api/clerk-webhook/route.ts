import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

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

  // Access + MailerLite course group now happen at code redemption (/api/redeem).
  // Keeping the verified webhook as a log point and for future payment wiring.
  console.log("user.created", evt.data.id);
  return Response.json({ ok: true });
}
