import { connectToDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { authenticateUser } from "@/middlewares/auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  await connectToDB();

  try {
    const { user } = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;

    // Get activeRole from request body
    const { activeRole } = await req.json();

    if (!activeRole || !['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json({ success: false, message: "Invalid or missing activeRole" }, { status: 400 });
    }

    // Mark all unread notifications for this user and role as read
    const updated = await Notification.updateMany(
      { userId, role: activeRole, isRead: false },
      { isRead: true }
    );

    return NextResponse.json(
      { success: true, message: "Marked as read", updatedCount: updated.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/notifications/mark-as-read error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", details: error.message }, { status: 500 });
  }
}
