import { ROLES } from "@/lib/constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const publicPaths = [
    "/login",
    "/api/auth/login",
  ];

  const isPublicPath = publicPaths.includes(pathname);

  const authToken = req.cookies.get("auth_token")?.value;
  const userRole = req.cookies.get("user_role")?.value;

  if (authToken && userRole) {
    if (pathname === "/login") {
      const dashboardPath = `/${userRole.toLowerCase()}/dashboard`;
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    if (pathname.startsWith("/superadmin")) {
      if (userRole !== ROLES.SUPERADMIN) {
        const redirectPath = `/${userRole.toLowerCase()}/dashboard`;
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
    else if (pathname.startsWith("/admin")) {
      if (userRole !== ROLES.ADMIN && userRole !== ROLES.SUPERADMIN) {
        const redirectPath = `/${userRole.toLowerCase()}/dashboard`;
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
    else if (pathname.startsWith("/user")) {
      if (userRole !== ROLES.USER && userRole !== ROLES.ADMIN && userRole !== ROLES.SUPERADMIN) {
        const redirectPath = `/${userRole.toLowerCase()}/dashboard`;
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }

    return NextResponse.next();

  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/user/:path*", "/login"],
};
