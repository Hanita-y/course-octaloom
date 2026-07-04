import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { User } from "@clerk/nextjs/server";

export function hasCourseAccess(user: Pick<User, "publicMetadata"> | null): boolean {
  return user?.publicMetadata?.courseAccess === true;
}

// Call at the top of every content page. Signed-out users are handled by proxy.ts.
export async function requireCourseAccess() {
  const user = await currentUser();
  if (!hasCourseAccess(user)) redirect("/redeem");
}
