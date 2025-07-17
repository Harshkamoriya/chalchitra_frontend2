import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import User from '@/models/user';


// modified for active role
export async function GET(req, context) {
  try {
    await connectToDB();
    const { params } = context;
    const conversationId = params.conv_id;

    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get('currentUserId');
    const activeRole = searchParams.get('activeRole');

    console.log('[getConversationById] conversationId:', conversationId);
    console.log('[getConversationById] currentUserId:', currentUserId);
    console.log('[getConversationById] activeRole:', activeRole);

    if (!conversationId || !currentUserId || !activeRole) {
      return NextResponse.json({ 
        success: false, 
        message: 'Conversation ID, currentUserId and activeRole are required' 
      }, { status: 400 });
    }

    // ✅ Defensive: check if activeRole is valid
    if (!['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid activeRole' 
      }, { status: 400 });
    }

    // ✅ Fetch conversation by id AND role
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      role: activeRole 
    }).lean();

    if (!conversation) {
      return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });
    }

    const conversationParticipants = conversation.participants;

    // ✅ Find the other participant
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
