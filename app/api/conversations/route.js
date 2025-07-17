import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Conversation from '@/models/Conversation';

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { currentUserId, receiverId, activeRole } = body;

    console.log('[createConversation] ids:', currentUserId, receiverId, 'role:', activeRole);

    if (!currentUserId || !receiverId || !activeRole) {
      console.warn('[createConversation] Missing IDs or role');
      return NextResponse.json(
        { success: false, message: 'Sender, receiver IDs and role are required' },
        { status: 400 }
      );
    }

    // Validate role value (defensive)
    if (!['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role value' },
        { status: 400 }
      );
    }

    // Check if conversation already exists for the same participants and role
    let existing = await Conversation.findOne({
      participants: { $all: [currentUserId, receiverId] },
      role: activeRole
    });

    if (existing) {
      console.log('[createConversation] Conversation already exists for role:', activeRole);
      return NextResponse.json({ success: true, conversation: existing }, { status: 200 });
    }

    // Create new conversation with role
    const newConv = new Conversation({
      participants: [currentUserId, receiverId],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: { [receiverId]: 0, [currentUserId]: 0 },
      role: activeRole
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
