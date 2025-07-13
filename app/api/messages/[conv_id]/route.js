import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/models/Message';


export async function GET(req, context) {
  try {
    await connectToDB();
    const conversationId = context.params.conv_id;
    if (!conversationId) {
      return NextResponse.json({ success: false, message: 'Conversation ID required' }, { status: 400 });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('replyTo', 'content type')          // 🪄 populate!
      .populate('forwardedFrom', 'content type')
      .lean();

    const plainMessages = messages.map(m => ({
      ...m,
      _id: m._id?.toString?.(),
      conversationId: m.conversationId?.toString?.(),
      sender: m.sender?.toString?.(),
      receiver: m.receiver?.toString?.(),
      replyTo: m.replyTo ? {
        _id: m.replyTo._id?.toString?.(),
        content: m.replyTo.content,
        type: m.replyTo.type
      } : null,
      forwardedFrom: m.forwardedFrom ? {
        _id: m.forwardedFrom._id?.toString?.(),
        content: m.forwardedFrom.content,
        type: m.forwardedFrom.type
      } : null
    }));

    return NextResponse.json({ success: true, messages: plainMessages }, { status: 200 });
  } catch (error) {
    console.error('[getConversationById] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

//  function for updating status using message id
export async function PATCH(req) {
  try {
    await connectToDB();

    const { user } = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    // Parse body properly
    const body = await req.json();
    const { messageId, status } = body;

    if (!messageId || !status) {
      return NextResponse.json({ success: false, message: "Missing messageId or status" }, { status: 400 });
    }

    // Update message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true } // return the updated document
    );

    if (!updatedMessage) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message updated successfully", updatedMessage });
  } catch (error) {
    console.error('[PATCH] Error updating message status:', error);
    return NextResponse.json({ success: false, message: "Internal server error", details: error.message }, { status: 500 });
  }
}
