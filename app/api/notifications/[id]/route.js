import { NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const { user } = await authenticateUser(req); // make sure the user is logged in
    const id = params.id;
    const { isRead, activeRole } = await req.json();

    if (!['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json({ error: 'Invalid activeRole' }, { status: 400 });
    }

    // Find the notification and check ownership + role
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: user._id, role: activeRole },
      { isRead },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const { user } = await authenticateUser(req);
    const id = params.id;

    // Optionally get activeRole from search params or body
    const { searchParams } = new URL(req.url);
    const activeRole = searchParams.get('activeRole');

    if (!['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json({ error: 'Invalid activeRole' }, { status: 400 });
    }

    // Delete only if user owns this notification and role matches
    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: user._id,
      role: activeRole
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
