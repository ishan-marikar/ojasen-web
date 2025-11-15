import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/about",
    "/contact",
    "/events",
    "/booking"
  ];
  
  // Check if the current route is public or a static asset
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith("/services") ||
                       pathname.startsWith("/healers") ||
                       pathname.startsWith("/_next/") || 
                       pathname.startsWith("/api/") || 
                       pathname.startsWith("/favicon.ico") ||
                       pathname.startsWith("/hero/") || 
                       pathname.startsWith("/images/");

  // If there's no session cookie and trying to access a protected route, redirect to sign-in
  if (!sessionCookie && !isPublicRoute) {
    // Allow non-existent routes to show 404 by not redirecting
    // Only redirect if we're trying to access a known protected route
    // For simplicity, we'll check if it's a likely app route
    const isLikelyAppRoute = pathname.startsWith("/dashboard") || 
                            pathname.startsWith("/admin") || 
                            pathname.includes("/profile");
    
    if (isLikelyAppRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // For other routes (including non-existent ones), let them pass through to show 404
  }
  
  // If there is a session cookie and trying to access sign-in or sign-up, redirect to dashboard
  if (sessionCookie && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Define which routes the proxy should run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};