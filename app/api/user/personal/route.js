// app/api/user/personal/route.js
import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";

export async function PATCH(req) {
  console.log("[PATCH] /api/user/personal → Authenticating user...");
  const authResult = await authenticateUser(req);
  console.log("Auth result:", authResult);

  if (authResult instanceof Response) {
    console.log("Authentication failed, returning error Response");
    return authResult;
  }

  const { user } = authResult;
  console.log("Authenticated user:", user);

  if (!user) {
    console.log("User is undefined after authentication");
    return NextResponse.json({ success: false, status: 404 });
  }

  await connectToDB();

  try {
    const body = await req.json();
    console.log("Received body for update:", body);

    const {
      firstName,
      lastName,
      displayName,
      profileImage,
      description,
      languages,
    } = body;

    const updateFields = {
      name: `${firstName} ${lastName}`,
      displayName,
      profileImage,
      description,
      languages,
      isSeller: true,
      role: "seller",
    };

    console.log("Updating user fields:", updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[PATCH] Server error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



export async function GET(req) {
  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) return authResult;

  const { user } = authResult;
  await connectToDB();

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: existingUser });
  } catch (error) {
    console.error("[GET] personal info error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
