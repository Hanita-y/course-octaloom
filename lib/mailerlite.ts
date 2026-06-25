// MailerLite bridge. The course stores signups in Clerk; this pushes them into
// MailerLite so the thank-you automation (trigger: joins the Course group) can fire,
// and so newsletter opt-ins land in their own group.

const API = "https://connect.mailerlite.com/api";

// Group IDs created for this course. Override per-environment via env if needed.
export const GROUPS = {
  course: process.env.MAILERLITE_GROUP_COURSE || "191005477850580526",
  newsletter: process.env.MAILERLITE_GROUP_NEWSLETTER || "191005479104677105",
};

type UpsertInput = {
  email: string;
  name?: string;
  groups?: string[];
  fields?: Record<string, string>;
};

// POST /subscribers upserts: creates the subscriber or updates an existing one,
// and merges the given groups onto them without removing other memberships.
export async function upsertSubscriber({ email, name, groups, fields }: UpsertInput) {
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) throw new Error("missing MAILERLITE_API_KEY");

  const f: Record<string, string> = { ...(fields || {}) };
  if (name) f.name = name;

  const body: Record<string, unknown> = { email };
  if (groups?.length) body.groups = groups;
  if (Object.keys(f).length) body.fields = f;

  const r = await fetch(`${API}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`mailerlite ${r.status}: ${t.slice(0, 200)}`);
  }
  return r.json();
}
