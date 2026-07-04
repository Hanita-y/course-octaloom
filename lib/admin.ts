import type { User } from "@clerk/nextjs/server";

export function isAdmin(user: User | null): boolean {
  const admins = (process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  return !!email && admins.includes(email);
}
