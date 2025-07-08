// // Notifications API route
// import { NextResponse } from 'next/server';
// import Notification from '@/models/Notification';
// import { connectToDB } from '@/lib/db';

// export async function GET(request) {
//   try {
//     await connectToDB();
    
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
    
//     if (!userId) {
//       return NextResponse.json({ error: 'User ID required' }, { status: 400 });
//     }

//     const notifications = await Notification.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     const unreadCount = await Notification.countDocuments({ 
//       userId, 
//       isRead: false 
//     });

//     return NextResponse.json({ 
//       notifications,
//       unreadCount 
//     });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await connectDB();
    
//     const { userId, type, title, message, actionUrl } = await request.json();
    
//     const notification = new Notification({
//       userId,
//       type,
//       title,
//       message,
//       actionUrl
//     });

//     await notification.save();

//     return NextResponse.json({ success: true, notification });
//   } catch (error) {
//     console.error('Error creating notification:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }