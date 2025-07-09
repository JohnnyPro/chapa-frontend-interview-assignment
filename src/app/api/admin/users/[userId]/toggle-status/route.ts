import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    await new Promise((resolve) => setTimeout(resolve, 400))

    const userIndex = mockUsers.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    mockUsers[userIndex].isActive = !mockUsers[userIndex].isActive

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle user status",
      },
      { status: 500 },
    )
  }
}
