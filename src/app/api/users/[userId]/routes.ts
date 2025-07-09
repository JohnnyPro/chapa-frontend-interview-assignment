import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

export async function DELETE(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userId = request.cookies.get("user_id")?.value;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID not found in cookies",
        },
        { status: 400 }
      );
    }
    
    const userIndex = mockUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    mockUsers.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Removed User successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove user",
      },
      { status: 500 }
    );
  }
}