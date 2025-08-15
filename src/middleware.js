import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the auth cookie
  const authCookie = request.cookies.get("auth");

  // Get the pathname
  const { pathname } = request.nextUrl;

  // If the user is not authenticated and trying to access a protected page
  // exclude API routes to avoid redirecting API calls
  if (!authCookie && !pathname.startsWith("/api/") && pathname !== "/login") {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Match all routes except for:
// - Login page
// - API routes (to allow login API to work)
// - Public assets (static files, images, etc.)
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
