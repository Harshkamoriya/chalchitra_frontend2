import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import User from "@/models/user"; // ✅ correct import
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDB();
  const session = await getServerSession(authOptions); // ✅ fixed await

  // if (!session || !session.user?.email) {
  //   return NextResponse.json({
  //     success: false,
  //     message: "User unauthorized",
  //     status: 401,
  //   });
  // }

  try {
    const sessionEmail = session.user.email;
    const user = await User.findOne({ email: sessionEmail }); // ✅ correct method

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User found successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GET /api/user/me error:", error.message);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
}
