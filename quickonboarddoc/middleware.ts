import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  
  // Allow all API routes to pass through without auth check
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const session = req.auth;
  
  // If accessing dashboard or onboarding, check for workspace
  if (session?.user?.id && (pathname.startsWith("/dashboard") || pathname === "/onboarding")) {
    // Check if user has a workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });
    
    // If no workspace and not already on onboarding, redirect to onboarding
    if (!workspace && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    
    // If has workspace and on onboarding, redirect to dashboard
    if (workspace && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
