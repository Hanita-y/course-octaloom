import { auth, clerkClient } from "@clerk/nextjs/server";
import { buildDocHtml, type PrintSection } from "@/lib/print-pdf";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = process.env.RESEND_FROM || "OctaLoom <course@octaloom.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO || "hanita@octaloom.com";
const MAX_CHARS = 20_000;

// Signature, links and the "why did I get this" line. Lives server-side so the
// email carries it and the printed PDF stays a clean one-liner.
const FOOTER_HTML = `
  <p class="sign">
    זהו. יש לכם עכשיו נוסחת בידול כתובה, וזה יותר ממה שיש לרוב האנשים בלינקדאין.
    אם משהו כאן לא יושב, או שאתם רוצים זוג עיניים על התשובות לפני שמתחילים לכתוב,
    פשוט השיבו למייל הזה. אני קוראת הכול.
  </p>
  <p class="sig">חניתה יודובסקי · OctaLoom</p>
  <p class="links">
    <a href="https://course.octaloom.com/tools/identity-audit"><span class="ico">✍️</span>חזרה לתרגיל</a>
    <a href="https://course.octaloom.com"><span class="ico">🎓</span>הקורס</a>
    <a href="https://octaloom.com"><span class="ico">🌐</span>OctaLoom</a>
    <a href="https://www.linkedin.com/in/hanita-yudovski"><span class="ico-in">in</span>בואו נתחבר בלינקדאין</a>
  </p>
  <p class="fine">
    קיבלתם את המייל הזה כי ביקשתם לשלוח לעצמכם את התרגיל Identity Audit מתוך הקורס
    ״לינקדאין עם OctaLoom״. אם לא ביקשתם, אפשר להתעלם ממנו.
  </p>`;

// Emails a tool's filled-in output to the signed-in user's own address.
// Replaces the old mailto: link, which silently did nothing for anyone without
// a default mail client and truncated long bodies at the URL length limit.
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "email not configured" }, { status: 503 });
  }

  let body: {
    title?: string;
    eyebrow?: string;
    intro?: string;
    sections?: PrintSection[];
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const title = (body.title || "").trim();
  const sections = Array.isArray(body.sections) ? body.sections : [];
  if (!title || sections.length === 0) {
    return Response.json({ error: "missing title or sections" }, { status: 400 });
  }

  const size = sections.reduce((n, s) => n + (s.title?.length || 0) + (s.body?.length || 0), 0);
  if (size > MAX_CHARS) {
    return Response.json({ error: "content too long" }, { status: 413 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const to = user.primaryEmailAddress?.emailAddress;
  if (!to) return Response.json({ error: "no email on user" }, { status: 400 });

  const html = buildDocHtml({
    title,
    eyebrow: body.eyebrow,
    intro: body.intro,
    footerHtml: FOOTER_HTML,
    sections: sections.map((s) => ({ title: String(s.title || ""), body: String(s.body || "") })),
  });

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, reply_to: REPLY_TO, subject: title, html }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("resend send failed:", res.status, detail);
    return Response.json({ error: "send failed" }, { status: 502 });
  }

  return Response.json({ ok: true, to });
}
