// /app/api/messages/[conv_id]/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/user';

export async function GET(req,context) {
  try {
    await connectToDB();
    const conversationId = context.params.conv_id;
    console.log('[getConversationById] Received conversationId:', conversationId);

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: 'Conversation ID required' },
        { status: 400 }
      );
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
    console.log('[getConversationById] Messages fetched:', messages.length);

  

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('[getConversationById] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    // Debug logs
    console.log('[PATCH delete] req.url =', req.url);
    console.log('[PATCH delete] params =', params);

    // Extract messageId from query string
    const url = new URL(req.url);
    const rawMessageId = url.searchParams.get('messageId');
    console.log('[PATCH delete] raw messageId =', rawMessageId);

    if (!rawMessageId) {
      return NextResponse.json(
        { success: false, error: 'messageId query parameter required' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const messageId = rawMessageId.trim();
    console.log('[PATCH delete] trimmed messageId =', messageId);

    // Soft‐delete that single message
     const message = await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );
    console.log('[PATCH delete] Marked message deleted:', messageId);
const plainMessage = message.toObject();
plainMessage.receiver = message.receiver.toString();
plainMessage.sender = message.sender.toString();
    return NextResponse.json(
      { success: true },
      { status: 200 },plainMessage
    );
  } catch (error) {
    console.error('[PATCH delete] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete', details: error.message },
      { status: 500 }
    );
  }
}
