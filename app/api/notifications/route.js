import { NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    await connectToDB();

    const { user } = await authenticateUser(request);
    const userId = user._id;
    console.log(userId ,"user id in the notification fetch route")

    const { searchParams } = new URL(request.url);
    const activeRole = searchParams.get('activeRole');

    if (!userId || !activeRole) {
      return NextResponse.json({ error: 'User ID and activeRole required' }, { status: 400 });
    }

    // Defensive: validate role
    if (!['buyer', 'seller'].includes(activeRole)) {
      return NextResponse.json({ error: 'Invalid activeRole' }, { status: 400 });
    }

    // Fetch notifications filtered by userId and role
    const notifications = await Notification.find({ userId, role: activeRole })
      .sort({ createdAt: -1 })
      .limit(50);

    // Count unread notifications filtered by role
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      role: activeRole,
      isRead: false 
    });

    return NextResponse.json({ 
      success:true,
      message:"notification fetched successfully",
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();

    const { user } = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 401 });
    }

    const { notificationData } = await request.json();
    const { userId, type, title, message, actionUrl, role } = notificationData;

    if (!userId || !type || !title || !message || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Defensive: validate role
    if (!['buyer', 'seller'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
    }

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      actionUrl,
      role
    });

    await notification.save();

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', details: error.message }, { status: 500 });
  }
}
