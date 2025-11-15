import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Allow all API routes to pass through without auth check
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  
  // For non-API routes, use the default auth behavior
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
