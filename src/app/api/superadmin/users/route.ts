import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { hashPassword } from "@/lib/auth/auth";
import { MockUser } from "@/lib/types/user";

export async function POST(request: NextRequest) {
  try {
    const { name, password, email, role } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newAdmin: MockUser = {
      id: Date.now().toString(),
      name,
      password: await hashPassword(password),
      email,
      role: role,
      isActive: true,
      walletBalance: 0,
      totalPayments: 0,
    };

    mockUsers.push(newAdmin);

    return NextResponse.json({
      success: true,
      user: newAdmin,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add admin",
      },
      { status: 500 }
    );
  }
}
