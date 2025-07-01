import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { authenticateUser } from "@/middlewares/auth";

export async function GET(req) {
  await connectToDB();

  const { user } = await authenticateUser(req); // ✅ await here

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found", status: 404 });
  }

  try {
    const id = user._id;
    console.log(id, "id in the user/me/personal");

    const foundUser = await User.findById(id); // ✅ changed from `User.findOne({ id })`

    if (!foundUser) {
      return NextResponse.json({
        success: false,
        message: "User not found in DB",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User found successfully",
      user: {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
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
