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
