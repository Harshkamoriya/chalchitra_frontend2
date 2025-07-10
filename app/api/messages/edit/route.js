// app/api/messages/[messageId]/edit/route.js
import { NextResponse } from 'next/server';
import { connectToDB }  from '@/lib/db';
import Message  from '@/models/Message';

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const raw = await req.text();
console.log('raw body:', raw);
const { content, messageId } = JSON.parse(raw);

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });
    }

    const updated = await Message.findByIdAndUpdate(
      messageId,
      { content, isEdited: true, editedAt: new Date() },
      { new: true }
    ).lean();

    // (Optional) emit via Socket.IO from your server:
    // io.emit('message-edited', updated);

    return NextResponse.json({ success: true, message: updated });
  } catch (err) {
    console.error('[Edit message] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to edit' }, { status: 500 });
  }
}
