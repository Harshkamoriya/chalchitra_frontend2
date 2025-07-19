import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';
import Orders from '@/models/orders';
import Gigs from '@/models/Gigs';
import Transaction from '@/models/transaction';
import Withdrawal from '@/models/Withdrwal';

export async function GET(request) {
  try {
    console.log('[Backend] Starting analytics overview API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const sellerId = user._id;
    console.log('[Backend] Authenticated seller:', sellerId);

    // Check if user is a seller
    if (!user.isSeller) {
      console.log('[Backend] User is not a seller');
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied. User is not a seller.' 
      }, { status: 403 });
    }

    // Get query parameters for date range
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'last-3-months';
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'last-30-days':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case 'last-3-months':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      case 'last-6-months':
        startDate = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        break;
      case 'last-year':
        startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    }

    console.log('[Backend] Date range:', { startDate, endDate: now, timeRange });

    // Fetch all seller's orders
    const allOrders = await Orders.find({ seller: sellerId })
      .populate('buyer', 'name email')
      .populate('gig', 'title category')
      .sort({ createdAt: -1 });

    console.log('[Backend] Total orders found:', allOrders.length);

    // Filter orders by date range
    const ordersInRange = allOrders.filter(order => 
      new Date(order.createdAt) >= startDate
    );

    console.log('[Backend] Orders in range:', ordersInRange.length);

    // Calculate overview metrics
    const totalEarnings = allOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

    const totalOrders = allOrders.filter(order => order.status === 'completed').length;
    
    const avgOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    const completedOrdersInRange = ordersInRange.filter(order => order.status === 'completed');
    const completionRate = ordersInRange.length > 0 
      ? (completedOrdersInRange.length / ordersInRange.length) * 100 
      : 0;

    // Calculate average delivery time
    const deliveredOrders = allOrders.filter(order => 
      order.status === 'completed' && order.delivery?.deliveredAt
    );
    
    const avgDeliveryTime = deliveredOrders.length > 0
      ? deliveredOrders.reduce((sum, order) => {
          const orderDate = new Date(order.createdAt);
          const deliveryDate = new Date(order.delivery.deliveredAt);
          const daysDiff = (deliveryDate - orderDate) / (1000 * 60 * 60 * 24);
          return sum + daysDiff;
        }, 0) / deliveredOrders.length
      : 0;

    // Get seller's gigs for additional metrics
    const sellerGigs = await Gigs.find({ seller: sellerId });
    console.log('[Backend] Seller gigs found:', sellerGigs.length);

    const totalViews = sellerGigs.reduce((sum, gig) => sum + (gig.views || 0), 0);
    const totalImpressions = sellerGigs.reduce((sum, gig) => sum + (gig.impressions || 0), 0);
    const totalClicks = sellerGigs.reduce((sum, gig) => sum + (gig.clicks || 0), 0);

    // Calculate client satisfaction (average rating)
    const ratedOrders = allOrders.filter(order => order.isRated);
    const clientSatisfaction = ratedOrders.length > 0
      ? ratedOrders.reduce((sum, order) => sum + (order.rating?.average || 5), 0) / ratedOrders.length
      : 0;

    // Calculate repeat client rate
    const uniqueBuyers = [...new Set(allOrders.map(order => order.buyer._id.toString()))];
    const repeatClients = uniqueBuyers.filter(buyerId => {
      const buyerOrders = allOrders.filter(order => order.buyer._id.toString() === buyerId);
      return buyerOrders.length > 1;
    });
    const repeatClientRate = uniqueBuyers.length > 0 
      ? (repeatClients.length / uniqueBuyers.length) * 100 
      : 0;

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      orderId: { $in: allOrders.map(order => order._id) }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('orderId', 'serviceTitle price');

    console.log('[Backend] Recent transactions found:', recentTransactions.length);

    // Calculate trends data (weekly data for the selected period)
    const trendsData = [];
    const weeksToShow = Math.min(10, Math.ceil((now - startDate) / (7 * 24 * 60 * 60 * 1000)));
    
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const weekOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekStart && orderDate < weekEnd;
      });

      const weekEarnings = weekOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.transferAmount || (order.price * 0.95)), 0) / 100;

      const weekCompletedOrders = weekOrders.filter(order => order.status === 'completed').length;

      trendsData.push({
        date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: weekEarnings,
        orders: weekOrders.length,
        completedOrders: weekCompletedOrders,
        views: Math.floor(Math.random() * 50) + 20, // Simulated for now
        messages: Math.floor(Math.random() * 15) + 5 // Simulated for now
      });
    }

    console.log('[Backend] Trends data calculated for', trendsData.length, 'periods');

    const responseData = {
      overview: {
        totalEarnings,
        totalOrders,
        avgOrderValue,
        completionRate,
        avgDeliveryTime,
        clientSatisfaction,
        repeatClientRate,
        profileViews: totalViews,
        totalImpressions,
        totalClicks,
        activeGigs: sellerGigs.filter(gig => gig.status === 'live').length
      },
      trends: trendsData,
      recentTransactions: recentTransactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount / 100,
        status: tx.status,
        date: tx.createdAt,
        orderId: tx.orderId?._id,
        serviceTitle: tx.orderId?.serviceTitle || 'Service'
      })),
      timeRange,
      dateRange: {
        start: startDate,
        end: now
      }
    };

    console.log('[Backend] Analytics overview response prepared');

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('[Backend] Error in analytics overview API:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 });
  }
}