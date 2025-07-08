// /app/api/conversations/route.js to create conversation


import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Conversation from '@/models/Conversation';

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { currentUserId, receiverId } = body;

    console.log('[createConversation] ids:', currentUserId, receiverId);

    if (!currentUserId || !receiverId) {
      console.warn('[createConversation] Missing IDs');
      return NextResponse.json(
        { success: false, message: 'Sender and receiver IDs required' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    let existing = await Conversation.findOne({
      participants: { $all: [currentUserId, receiverId] }
    });

    if (existing) {
      console.log('[createConversation] Conversation already exists');
      return NextResponse.json({ success: true, conversation: existing }, { status: 200 });
    }

    // Create new conversation
    const newConv = new Conversation({
      participants: [currentUserId, receiverId],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: { [receiverId]: 0, [currentUserId]: 0 }
    });

    await newConv.save();
    console.log('[createConversation] New conversation created:', newConv._id);

    return NextResponse.json({ success: true, conversation: newConv }, { status: 201 });
  } catch (error) {
    console.error('[createConversation] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
