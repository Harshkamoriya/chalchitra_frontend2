// // Individual notification API route
// import { NextResponse } from 'next/server';
// import Notification from '@/models/Notification';
// import { connectToDB } from '@/lib/db';

// export async function PATCH(request, { params }) {
//   try {
//     await connectToDB();
    
//     const { id } = params;
//     const { isRead } = await request.json();
    
//     const notification = await Notification.findByIdAndUpdate(
//       id,
//       { isRead },
//       { new: true }
//     );

//     if (!notification) {
//       return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, notification });
//   } catch (error) {
//     console.error('Error updating notification:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
    
//     const { id } = params;
    
//     const notification = await Notification.findByIdAndDelete(id);

//     if (!notification) {
//       return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }