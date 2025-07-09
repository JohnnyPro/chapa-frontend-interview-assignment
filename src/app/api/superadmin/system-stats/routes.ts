import { NextResponse } from "next/server";
import { systemStats } from "@/lib/mock-data";

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      stats: systemStats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch system stats",
      },
      { status: 500 }
    );
  }
}
