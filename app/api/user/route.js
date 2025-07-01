// isme get user update user delete user ye teen code like

import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req) {
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "user not authorized", status: 401 });
  }

  await connectToDB();
  try {
    const id = user._id;
    console.log(id, "id in the user/me/personal");

    const dbUser = await User.findOne({ _id: id });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "user not found", status: 404 });
    }

    console.log("user found succs", dbUser);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User found successfully",
      user: dbUser
    });
  } catch (error) {
    console.error("GET /api/user/me error:", error.message);
    return NextResponse.json({ success: false, message: "something went wrong server error", error });
  }
}
// put or update the user

export async function PUT(req) {
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not authorized", status: 401 });
  }

  await connectToDB();
  try {
    const id = user._id;
    const updateData = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found", status: 404 });
    }

    console.log("User updated successfully", updatedUser);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT /api/user error:", error.message);
    return NextResponse.json({ success: false, message: "Something went wrong", error });
  }
}


// ## ✅ DELETE /api/user

export async function DELETE(req) {
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not authorized", status: 401 });
  }

  await connectToDB();
  try {
    const id = user._id;
    console.log(id, "User id in delete backend");

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found", status: 404 });
    }

    console.log("User deleted successfully", deletedUser);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/user error:", error.message);
    return NextResponse.json({ success: false, message: "Something went wrong", error });
  }
}