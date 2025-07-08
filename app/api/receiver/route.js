import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import User from "@/models/user";

export async function GET(req) {
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDB();

    const receiverId = req.nextUrl.searchParams.get("receiverId");
    console.log("[GET receiver] receiverId:", receiverId);

    if (!receiverId) {
      return NextResponse.json(
        { success: false, message: "Receiver ID is required" },
        { status: 400 }
      );
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { success: false, message: "Receiver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Receiver found successfully", receiver },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET receiver] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
