import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { validatePassword } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { UserSession } from "@/lib/types/auth";
import { UserRole } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find((u) => u.email === email);

    if (foundUser && (await validatePassword(password, foundUser.password))) {
      const cookieStore = await cookies();
      const session: UserSession = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as UserRole,
      };

      // This would've been how I would set the token as http-only
      cookieStore.set(
        "auth_token",
        "JWT TOKEN RESPONSE FROM BACKEND WOULD BE HERE",
        { httpOnly: true }
      );

      // Set user details in cookies directly for demo purposes
      // In a real application, I would set a JWT token instead of user details, then decode it on the client side
      cookieStore.set("user_id", foundUser.id, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        sameSite: "lax",
      });
      cookieStore.set("user_role", foundUser.role, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        sameSite: "lax",
      });
      cookieStore.set("user_name", foundUser.name, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        sameSite: "lax",
      });
      cookieStore.set("user_email", foundUser.email, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
        user: session,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
