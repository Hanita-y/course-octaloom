import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { getKv } from "@/lib/kv";
import { createCodes, listCodes } from "@/lib/codes";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdmin(await currentUser())) return new Response("not found", { status: 404 });
  return Response.json({ codes: await listCodes(getKv()) });
}

export async function POST(request: Request) {
  if (!isAdmin(await currentUser())) return new Response("not found", { status: 404 });
  let body: { count?: number; note?: string; lockedEmail?: string } = {};
  try {
    body = await request.json();
  } catch {}
  const count = Math.min(Math.max(Number(body.count) || 1, 1), 20);
  const codes = await createCodes(getKv(), count, {
    note: body.note?.trim() || undefined,
    lockedEmail: body.lockedEmail?.trim() || undefined,
  });
  return Response.json({ codes });
}
