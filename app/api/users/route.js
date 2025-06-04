import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return NextResponse.json({
      success: true,
      status: 200,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Failed to fetch users",
    });
  }
}
