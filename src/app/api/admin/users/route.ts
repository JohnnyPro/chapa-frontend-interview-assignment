import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { hashPassword } from "@/lib/auth/auth";
import { MockUser } from "@/lib/types/user";
import { ROLES } from "@/lib/constants";

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      users: mockUsers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

// Create non-admin user
export async function POST(request: NextRequest) {
  try {
    const { name, password, email, role } = await request.json();

    if (role === ROLES.ADMIN) {
      return NextResponse.json(
        {
          success: false,
          error: "Only superadmin can create admins",
        },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newAdmin: MockUser = {
      id: Date.now().toString(),
      name,
      password: await hashPassword(password),
      email,
      role: ROLES.USER,
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
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add admin",
      },
      { status: 500 }
    );
  }
}
