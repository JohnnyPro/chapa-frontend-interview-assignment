import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const { newBalance } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 200));

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

    mockUsers[userIndex].walletBalance = newBalance;

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update balance",
      },
      { status: 500 }
    );
  }
}
