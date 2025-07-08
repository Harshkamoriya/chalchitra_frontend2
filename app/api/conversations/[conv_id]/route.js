import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import User from '@/models/user';

export async function GET(req, context) {
  try {
    await connectToDB();
    const { params } = context;
    const conversationId = params.conv_id;

    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get('currentUserId');

    console.log('[getConversationById] conversationId:', conversationId);
    console.log('[getConversationById] currentUserId:', currentUserId);

    if (!conversationId) {
      return NextResponse.json({ success: false, message: 'Conversation ID required' }, { status: 400 });
    }

    // ✅ Fetch the conversation object
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });
    }

    const conversationParticipants = conversation.participants; // assume it is an array of userIds

    // ✅ Find the other user
    const receiverId = conversationParticipants.find(p => p.toString() !== currentUserId);
    console.log('receiverId:', receiverId);

    // ✅ Fetch receiver user details
    const receiver = receiverId ? await User.findById(receiverId).lean() : null;

    return NextResponse.json(
      { success: true, conversation, receiver },
      { status: 200 }
    );
  } catch (error) {
    console.error('[getConversationById] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
