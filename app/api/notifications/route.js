// Notifications API route
import { NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    await connectToDB();
    
    const {user} = await authenticateUser(req);
    const userId = user._id;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const {user} = await authenticateUser(req);
    if(!user){
        return NextResponse.json({success:false , message: "you are not authorized "},{status:401});
    }

    
    const { notificationData} = await request.json();
    
    const notification = new Notification({
      userId :notificationData.userId,
      type :notificationData.type,
      title :notificationData.title,
      message :notificationData.message,
      actionUrl :notificationData.actionUrl
    });

    await notification.save();

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}