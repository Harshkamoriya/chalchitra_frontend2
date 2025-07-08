
// import { connectToDB } from "@/lib/db";
// import Notification from "@/models/Notification";
// import { authenticateUser } from "@/middlewares/auth";
// import { NextResponse } from "next/server";

// export async function PATCH(req) {
//   await connectToDB();

//   try {
//     const { user } = await authenticateUser(req);
//     if (!user) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { notifId } = await req.json();
//     const updated = await Notification.findOneAndUpdate(
//       { _id: notifId, userId: user._id },
//       { isRead: true },
//       { new: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Marked as read", notif: updated }, { status: 200 });
//   } catch (error) {
//     console.error("PATCH /api/notifications/mark-as-read error:", error);
//     return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
//   }
// }
