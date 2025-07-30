import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicRoute = path === "/auth/login" || path === "/auth/register";
  const token = request.cookies.get("token")?.value || "";
  console.log(localStorage.getItem("user"), "token.......................");

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
