import { type NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
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

    await new Promise((resolve) => setTimeout(resolve, 800));

    const userTransactions = mockTransactions.filter(
      (t) => t.senderId === userId || t.receiverId === userId
    );
    return NextResponse.json({
      success: true,
      transactions: userTransactions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTransaction = {
      id: Date.now().toString(),
      ...transactionData,
      date: new Date().toISOString(),
      status: "completed" as const,
    };

    mockTransactions.unshift(newTransaction);

    return NextResponse.json({
      success: true,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create transaction",
      },
      { status: 500 }
    );
  }
}
