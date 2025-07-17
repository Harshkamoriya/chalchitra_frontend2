// Messages API route
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import { authenticateUser } from '@/middlewares/auth';

// this get function fetches
//  all the conversation of
//  an user by userid as
// Messages API route


export async function GET(req) {
  try {
    await connectToDB();
    const {user} = await authenticateUser(req);
    if(!user){return NextResponse.json({status:401})}

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const activeRole = searchParams.get('activeRole');

    if (!userId || !activeRole) {
      return NextResponse.json({ error: 'User ID and activeRole are required' }, { status: 400 });
    }

    // Find conversations where user is a participant and conversation has the matching role
    const conversations = await Conversation.find({ 
      participants: userId,
      role: activeRole
    })
    .populate('participants', 'name email avatar')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 });

    // Compute total unread messages for this user
    const unreadCount = conversations.reduce((total, conv) => {
      return total + (conv.unreadCount.get(userId) || 0);
    }, 0);

    console.log('Fetched conversations:', conversations);
    return NextResponse.json({ 
      conversations,
      unreadCount 
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('[POST] Connecting to DB...');
    await connectToDB();
    console.log('[POST] Connected to DB ✅');

    const formData = await request.formData();
    console.log('[POST] Received formData ✅');

    const conversationId = formData.get('conversationId');
    const senderId = formData.get('senderId');
    const receiverId = formData.get('receiverId');
    const content = formData.get('content');
    const type = formData.get('type') || 'text';
    const file = formData.get('file');
    const fileUrl = formData.get('fileUrl');
    const replyTo = formData.get('replyTo') || null;
    const forwardedFrom = formData.get('forwardedFrom') || null;

    console.log('[POST] Parsed fields:', {
      conversationId,
      senderId,
      receiverId,
      content,
      type,
      file: file ? { name: file.name, size: file.size } : null,
      fileUrl: fileUrl || null,
      replyTo,
      forwardedFrom
    });

    let fileName = null;
    let fileSize = null;

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      console.log('[POST] File info:', { fileName, fileSize, fileUrl });
    }

    const message = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      content,
      type,
      fileName,
      fileUrl,
      fileSize,
      status: 'sent',
      replyTo: replyTo || null,
      forwardedFrom: forwardedFrom || null
    });

    console.log('[POST] Saving message to DB...');
    await message.save();

    // 🔍 populate replyTo & forwardedFrom
    await message.populate('replyTo', 'content type');
    await message.populate('forwardedFrom', 'content type');

    const plainMessage = message.toObject();
    plainMessage.conversationId = message.conversationId?.toString?.();
    plainMessage.receiver = message.receiver?.toString?.();
    plainMessage.sender = message.sender?.toString?.();

    console.log('[POST] Message saved successfully ✅', plainMessage);

    return NextResponse.json({ success: true, plainMessage });
  } catch (error) {
    console.error('[POST] Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

//  this function updates the messages status

export async function PATCH(req) {
  try {
    await connectToDB();
    const { user } = await authenticateUser(req);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
    }

    // parse JSON body properly
    const body = await req.json();
    const { messageId, status } = body;

    if (!messageId || !status) {
      return NextResponse.json({ success: false, message: "Missing messageId or status" }, { status: 400 });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedMessage });
  } catch (error) {
    console.error('[PATCH] Error updating message status:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
