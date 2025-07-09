import bcrypt from "bcrypt";
const saltRounds = 10;
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UserSession } from "@/lib/types/auth";
import { UserRole } from "../constants";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function validatePassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, storedHash);
  return isMatch;
}


export async function getSessionFromCookies(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // In a real application, I would decode the JWT(auth_token) to get the user info
  // But in this demo implementation, I set the role on the cookie directly
  const userId = cookieStore.get("user_id")?.value;
  const userName = cookieStore.get("user_name")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  const userRole = cookieStore.get("user_role")?.value;
  if (!authToken || !userRole || !userName || !userEmail || !userId) {
    return null;
  }
  return {
    id: userId,
    name: userName,
    email: userEmail,
    role: userRole as UserRole,
  };
}

export async function clearAuthCookies() {
  const response = new NextResponse();
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  response.cookies.set("auth_token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("user_role", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("user_name", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("user_email", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("user_id", "", { ...cookieOptions, maxAge: 0 });

  return response;
}
