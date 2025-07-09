import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { Profile } from "@/lib/types/profile";

export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userId = request.cookies.get("user_id")?.value;

    const foundUser = userId ? mockUsers.find((u) => u.id === userId) : null;
   
    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to find user",
        },
        { status: 404 }
      );
    }

    const { password, ...profile } = foundUser || {};
    return NextResponse.json({
      success: true,
      profile: profile as Profile,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
