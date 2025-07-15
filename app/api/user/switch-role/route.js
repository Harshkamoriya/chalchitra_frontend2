import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

export async function PATCH(req) {
  try {
    await connectToDB();

    // Authenticate user; assume it returns { user }
    const { user } = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
        status: 401,
      });
    }

    const { newRole } = await req.json();

    if (!newRole || !["buyer", "seller"].includes(newRole)) {
      return NextResponse.json({
        success: false,
        message: "Invalid role provided",
        status: 400,
      });
    }

    const userId = user._id;
    console.log("Switching role for user:", userId);

    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    updatedUser.role = newRole;
    await updatedUser.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Role updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("POST /api/user/switch-role error:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
