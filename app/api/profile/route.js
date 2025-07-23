import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

// PATCH route to update user profile fields
export async function PATCH(req) {
  try {
    console.log("[API] PATCH /api/profile called");

    // Authenticate the user
    const authResult = await authenticateUser(req);
    if (authResult instanceof Response) {
      console.warn("[API] Authentication failed");
      return authResult;
    }

    const { user } = authResult;
    console.log("[API] Authenticated user ID:", user._id);

    // Parse the request body
    const body = await req.json();
    console.log("[API] Received body:", body);

    // Allowed fields
    const allowedFields = [
      "name",
      "displayName",
      "description",
      "country",
      "languages",
      "phoneNumber",
      "phoneVerified",
      "emailVerified",
      "preferredWorkingHours",
      "communicationStyle",
      "workingStyle",
      "responseTime",
      "feedbackStyle",
      "projectTypes",
      "budgetRange",
      "image",
    ];

    // Filter valid fields
    const updates = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      console.warn("[API] No valid fields provided for update");
      return NextResponse.json(
        { error: "No valid fields provided for update", success: false },
        { status: 400 }
      );
    }

    console.log("[API] Updating fields:", updates);

    // Connect DB
    await connectToDB();
    console.log("[API] Connected to DB");

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      console.error("[API] User not found");
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
    }

    console.log("[API] User updated:", updatedUser);

    return NextResponse.json(
      { message: "Profile updated successfully", success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
