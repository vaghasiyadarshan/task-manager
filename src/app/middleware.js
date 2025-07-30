import { NextResponse } from "next/server";

export function middleware(request) {
  // Log basic request info
  console.log("Middleware triggered for:", request.method, request.url);

  const path = request.nextUrl.pathname;
  console.log("Path being accessed:", path);

  // Get token from cookies (server-side compatible)
  const token = request.cookies.get("token")?.value;
  console.log("Token found:", token || "No token present");

  const isPublicRoute = path === "/auth/login" || path === "/auth/register";
  console.log("Is public route?", isPublicRoute);

  // Redirect logged-in users away from auth pages
  if (isPublicRoute && token) {
    console.log("User has token, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Redirect non-logged-in users to login
  if (!isPublicRoute && !token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  console.log("Request allowed to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
