import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({
      success: false,
      message: "User unauthorized",
      status: 401,
    });
  }

  try {
    const { newRole } = await req.json();
    const sessionEmail = session.user.email;

    const user = await User.findOne({ email: sessionEmail });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    user.role = newRole;
    await user.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Role updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/user/switch-role error:", error.message);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
