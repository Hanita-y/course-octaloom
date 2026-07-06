import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/join(.*)",
  "/api/waitlist",
  "/api/clerk-webhook(.*)", // Clerk calls this server-to-server, no user session
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;
  const { userId } = await auth();
  if (userId) return;
  // Signed-out visitors land on the waitlist screen, not the sign-in form.
  // (The waitlist links out to sign-in and to /join for code holders.)
  const accepts = request.headers.get("accept") || "";
  if (request.method === "GET" && accepts.includes("text/html")) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
