
import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { authenticateUser } from "@/middlewares/auth";


//  this function is to update the status of the messagee to seen
export async function PATCH(req) {
  try {
    await connectToDB();
    const { user } = await authenticateUser(req);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { conversationId, receiverId } = body;

    if (!conversationId || !receiverId) {
      return NextResponse.json({ success: false, message: "Missing conversationId or receiverId" }, { status: 400 });
    }

    // update all messages in this conversation where:
    // - receiver is this user
    // - status is 'delivered' → update to 'seen'
const result = await Message.updateMany(
  { conversationId, receiver: receiverId, status: { $in: ['sent', 'delivered'] } },
  { status: 'seen' }
);

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('[PATCH] Error updating messages to seen:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
