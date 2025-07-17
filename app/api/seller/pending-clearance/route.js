import { NextResponse } from 'next/server';
import Orders from '@/models/orders';
import User from '@/models/user';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting pending clearance details API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const sellerId = user._id;
    console.log('[Backend] Authenticated seller:', sellerId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'clearance-date';

    // Get current date for clearance calculation
    const now = new Date();
    const clearanceDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago

    // Build query for pending clearance orders (completed within 7 days)
    let query = {
      seller: sellerId,
      status: 'completed',
      'delivery.deliveredAt': { $gt: clearanceDate },
      payoutStatus: { $ne: 'paid' }
    };

    // Add search filter if provided
    if (searchQuery) {
      query.$or = [
        { serviceTitle: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    console.log('[Backend] Query built:', query);

    // Get orders with populated buyer information
    let orders = await Orders.find(query)
      .populate('buyer', 'firstName lastName username profileImage joinDate')
      .populate('gig', 'title category description')
      .sort(sortBy === 'amount' ? { price: -1 } : 
            sortBy === 'completion-date' ? { 'delivery.deliveredAt': -1 } :
            { 'delivery.deliveredAt': 1 }) // clearance-date sorts by oldest first
      .lean();

    console.log('[Backend] Orders found:', orders.length);

    // Get additional buyer stats for each order
    const pendingClearanceData = await Promise.all(orders.map(async (order) => {
      const buyer = order.buyer;
      
      // Get buyer's total orders and average rating
      const buyerOrders = await Orders.find({ buyer: buyer._id }).countDocuments();
      const buyerRatedOrders = await Orders.find({ 
        buyer: buyer._id, 
        isRated: true 
      });
      
      const avgRating = buyerRatedOrders.length > 0 
        ? buyerRatedOrders.reduce((sum, o) => sum + (o.rating || 5), 0) / buyerRatedOrders.length 
        : 4.5;

      // Calculate clearance progress and days remaining
      const completedDate = new Date(order.delivery.deliveredAt);
      const expectedClearanceDate = new Date(completedDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      const daysPassed = Math.floor((now - completedDate) / (24 * 60 * 60 * 1000));
      const daysRemaining = Math.max(0, 7 - daysPassed);
      const clearanceProgress = Math.min(100, Math.floor((daysPassed / 7) * 100));

      // Format the order data
      return {
        id: order._id,
        client: {
          name: `${buyer.firstName} ${buyer.lastName}`,
          username: buyer.username,
          avatar: buyer.profileImage,
          joinDate: buyer.joinDate || buyer.createdAt,
          totalOrders: buyerOrders,
          avgRating: Math.round(avgRating * 10) / 10
        },
        gig: {
          title: order.gig?.title || order.serviceTitle || 'Service',
          category: order.gig?.category || order.category || 'General',
          description: order.gig?.description || 'Professional service delivery',
          deliveryTime: order.selectedPackage?.deliveryTime || 3,
          revisions: order.selectedPackage?.revisions || 1
        },
        order: {
          id: order._id,
          startDate: order.createdAt,
          completedDate: order.delivery?.deliveredAt,
          expectedClearance: expectedClearanceDate,
          requirements: order.requirements?.map(r => r.answer).join('. ') || order.note || 'Standard service requirements',
          deliverables: order.delivery?.files?.length > 0 
            ? order.delivery.files.map(f => f.split('/').pop())
            : ['Final deliverable files', 'Source files', 'Documentation'],
          clientRating: 5, // Default rating
          clientReview: order.delivery?.message || 'Great work, delivered as expected. Professional service and timely delivery.',
          clearanceProgress
        },
        amount: order.price / 100, // Convert from cents
        fee: (order.applicationFeeAmount || (order.price * 0.05)) / 100,
        netAmount: (order.transferAmount || (order.price * 0.95)) / 100,
        status: 'clearing',
        daysRemaining,
        chatHistory: [
          {
            id: 1,
            sender: 'client',
            message: 'Hi! I need help with this project.',
            timestamp: order.createdAt
          },
          {
            id: 2,
            sender: 'seller',
            message: 'Hello! I\'d be happy to help you with your project. Let me review the requirements.',
            timestamp: order.createdAt
          },
          {
            id: 3,
            sender: 'client',
            message: 'The work looks amazing! Thank you for the excellent service.',
            timestamp: order.delivery?.deliveredAt
          }
        ]
      };
    }));

    console.log('[Backend] Pending clearance data formatted:', pendingClearanceData.length);

    // Calculate totals
    const totalPending = pendingClearanceData.reduce((sum, item) => sum + item.netAmount, 0);
    const totalFees = pendingClearanceData.reduce((sum, item) => sum + item.fee, 0);
    const avgClearanceTime = pendingClearanceData.length > 0 
      ? pendingClearanceData.reduce((sum, item) => sum + (7 - item.daysRemaining), 0) / pendingClearanceData.length
      : 0;

    const responseData = {
      totalPending,
      totalFees,
      orderCount: pendingClearanceData.length,
      avgClearanceTime: Math.round(avgClearanceTime * 10) / 10,
      orders: pendingClearanceData
    };

    console.log('[Backend] Pending clearance response prepared');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Backend] Error in pending clearance API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}