// Messages API route
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

// this get function fetches
//  all the conversation of
//  an user by userid as

export async function GET(req ) {
  try {
    await connectToDB();
    
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const conversations = await Conversation.find({ 
      participants: userId 
    })
    .populate('participants', 'name email avatar')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 });

    const unreadCount = conversations.reduce((total, conv) => {
      return total + (conv.unreadCount.get(userId) || 0);
    }, 0);

    console.log(conversations, "conversations")
    return NextResponse.json({ 
      conversations,
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
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

    console.log('[POST] Parsed fields:', {
      conversationId,
      senderId,
      receiverId,
      content,
      type,
      file: file ? { name: file.name, size: file.size } : null,
      fileUrl:fileUrl ? fileUrl :null
    });

    // Handle file upload if present
    // let fileUrl = null;
    let fileName = null;
    let fileSize = null;

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      fileUrl = `/uploads/${fileName}`; // Placeholder
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
  status:'sent'
});

    console.log('[POST] Saving message to DB...');
    await message.save();

const plainMessage = message.toObject();
plainMessage.conversationId = message.conversationId.toString();
plainMessage.receiver = message.receiver.toString();
plainMessage.sender = message.sender.toString();

    console.log('[POST] Message saved successfully ✅' , plainMessage);
    

    return NextResponse.json({ success: true, plainMessage });
  } catch (error) {
    console.error('[POST] Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
