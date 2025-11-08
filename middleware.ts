import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/about", "/contact", "/events"];
  
  // Check if the current route is public or a static asset
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith("/services") ||
                       pathname.startsWith("/healers") ||
                       pathname.startsWith("/_next/") || 
                       pathname.startsWith("/api/") || 
                       pathname.startsWith("/favicon.ico") ||
                       pathname.startsWith("/hero/") || pathname.startsWith("/images/");

  // If there's no session cookie and trying to access a protected route, redirect to sign-in
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  // If there is a session cookie and trying to access sign-in or sign-up, redirect to dashboard
  if (sessionCookie && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Define which routes the middleware should run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};