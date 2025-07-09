import { ROLES } from "@/lib/constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("auth_token")?.value;
  const userId = req.cookies.get("user_id")?.value;
  const userName = req.cookies.get("user_name")?.value;
  const userEmail = req.cookies.get("user_email")?.value;
  const userRole = req.cookies.get("user_role")?.value;

  let session = null;
  if (authToken && userRole && userName && userEmail && userId) {
    session = {
      id: userId,
      name: userName,
      email: userEmail,
      role: userRole,
    };
  }

  const pathname = req.nextUrl.pathname;

  //This where I would include routes taht should skip the RBAC protocol
  const publicRoutes: string[] = [];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (!session || typeof session === "string" || !session.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = session.role;

    if (pathname === "/login") {
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }

    if (
      pathname.startsWith("/admin") &&
      role !== ROLES.ADMIN &&
      role !== ROLES.SUPERADMIN
    ) {
      console.log(`ROLES ${role} not admin, redirecting to /${role}/dashboard`);
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }
    if (pathname.startsWith("/superadmin") && role !== ROLES.SUPERADMIN) {
      console.log(
        `ROLES ${role} not superadmin, redirecting to /${role}/dashboard`
      );
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }
    if (pathname.startsWith("/user") && role !== ROLES.USER) {
      console.log(`ROLES ${role} not user, redirecting to /${role}/dashboard`);
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }

    console.log("Access granted, proceeding to next");
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/user/:path*", "/login"],
};
