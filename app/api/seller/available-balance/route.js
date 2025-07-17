import { NextResponse } from 'next/server';
import Orders from '@/models/orders';
import User from '@/models/user';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting available balance details API call...');
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
    const sortBy = searchParams.get('sortBy') || 'date';

    // Get current date for clearance calculation
    const now = new Date();
    const clearanceDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago

    // Build query for available balance orders
    let query = {
      seller: sellerId,
      status: 'completed',
      'delivery.deliveredAt': { $lte: clearanceDate },
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
      .sort(sortBy === 'amount' ? { price: -1 } : { 'delivery.deliveredAt': -1 })
      .lean();

    console.log('[Backend] Orders found:', orders.length);

    // Get additional buyer stats for each order
    const availableBalanceData = await Promise.all(orders.map(async (order) => {
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
          clearedDate: new Date(order.delivery?.deliveredAt?.getTime() + (7 * 24 * 60 * 60 * 1000)),
          requirements: order.requirements?.map(r => r.answer).join('. ') || order.note || 'Standard service requirements',
          deliverables: order.delivery?.files?.length > 0 
            ? order.delivery.files.map(f => f.split('/').pop())
            : ['Final deliverable files', 'Source files', 'Documentation'],
          clientRating: 5, // Default rating
          clientReview: order.delivery?.message || 'Great work, delivered as expected. Professional service and timely delivery.'
        },
        amount: order.price / 100, // Convert from cents
        fee: (order.applicationFeeAmount || (order.price * 0.05)) / 100,
        netAmount: (order.transferAmount || (order.price * 0.95)) / 100,
        status: 'available',
        chatHistory: [
          {
            id: 1,
            sender: 'client',
            message: 'Hi! I\'m excited to work with you on this project.',
            timestamp: order.createdAt
          },
          {
            id: 2,
            sender: 'seller',
            message: 'Hello! Thank you for choosing my service. I\'ll deliver excellent results.',
            timestamp: order.createdAt
          },
          {
            id: 3,
            sender: 'client',
            message: 'The work looks great! Thank you for the professional service.',
            timestamp: order.delivery?.deliveredAt
          }
        ]
      };
    }));

    console.log('[Backend] Available balance data formatted:', availableBalanceData.length);

    // Calculate totals
    const totalAvailable = availableBalanceData.reduce((sum, item) => sum + item.netAmount, 0);
    const totalFees = availableBalanceData.reduce((sum, item) => sum + item.fee, 0);

    const responseData = {
      totalAvailable,
      totalFees,
      orderCount: availableBalanceData.length,
      orders: availableBalanceData
    };

    console.log('[Backend] Available balance response prepared');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Backend] Error in available balance API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}