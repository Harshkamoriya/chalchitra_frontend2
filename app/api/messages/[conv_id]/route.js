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

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

    const plainMessages = messages.map(m => ({
      ...m,
      conversationId: m.conversationId?.toString?.(),
      sender: m.sender?.toString?.(),
      receiver: m.receiver?.toString?.()
    }));

    return NextResponse.json({ success: true, messages: plainMessages }, { status: 200 });
  } catch (error) {
    console.error('[getConversationById] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const rawMessageId = url.searchParams.get('messageId');
    console.log('[PATCH delete] raw messageId =', rawMessageId);

    if (!rawMessageId) {
      return NextResponse.json(
        { success: false, error: 'messageId query parameter required' },
        { status: 400 }
      );
    }

    const messageId = rawMessageId.trim();
    console.log('[PATCH delete] trimmed messageId =', messageId);

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const plainMessage = message.toObject();
    plainMessage.sender = message.sender?.toString?.();
    plainMessage.receiver = message.receiver?.toString?.();

    return NextResponse.json(
      { success: true, message: plainMessage },
      { status: 200 }
    );

  } catch (error) {
    console.error('[PATCH delete] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete', details: error.message },
      { status: 500 }
    );
  }
}
