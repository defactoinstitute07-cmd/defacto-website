import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "./lib/auth-session";

async function hasValidAdminSession(request: NextRequest) {
  const user = await getAdminUserFromRequest(request);
  return Boolean(user);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = await hasValidAdminSession(request);

  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
