import { NextResponse } from 'next/server';
import Orders from '@/models/orders';
import Transaction from '@/models/transaction';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting earnings API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const sellerId = user._id;
    console.log('[Backend] Authenticated seller:', sellerId);

    // Get current date for calculations
    const now = new Date();
    const clearanceDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days ago

    // Calculate Available Balance (completed orders cleared after 7 days)
    const availableOrders = await Orders.find({
      seller: sellerId,
      status: 'completed',
      'delivery.deliveredAt': { $lte: clearanceDate },
      payoutStatus: { $ne: 'paid' }
    });

    const availableBalance = availableOrders.reduce((sum, order) => {
      return sum + (order.transferAmount || (order.price * 0.95)); // 5% platform fee
    }, 0);

    console.log('[Backend] Available balance calculated:', availableBalance);

    // Calculate Pending Clearance (completed orders within 7 days)
    const pendingOrders = await Orders.find({
      seller: sellerId,
      status: 'completed',
      'delivery.deliveredAt': { $gt: clearanceDate }
    });

    const pendingClearance = pendingOrders.reduce((sum, order) => {
      return sum + (order.transferAmount || (order.price * 0.95));
    }, 0);

    console.log('[Backend] Pending clearance calculated:', pendingClearance);

    // Calculate Active Orders Value
    const activeOrders = await Orders.find({
      seller: sellerId,
      status: { $in: ['active', 'delivered', 'revision'] }
    });

    const activeOrdersValue = activeOrders.reduce((sum, order) => {
      return sum + order.price;
    }, 0);

    console.log('[Backend] Active orders value calculated:', activeOrdersValue);

    // Calculate Lifetime Earnings
    const completedOrders = await Orders.find({
      seller: sellerId,
      status: 'completed'
    });

    const totalEarnings = completedOrders.reduce((sum, order) => {
      return sum + (order.transferAmount || (order.price * 0.95));
    }, 0);

    console.log('[Backend] Total earnings calculated:', totalEarnings);

    // Get Recent Transactions
    const recentTransactions = await Transaction.find({
      orderId: { $in: await Orders.find({ seller: sellerId }).distinct('_id') }
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('orderId', 'serviceTitle price')
    .lean();

    // Format transactions for frontend
    const formattedTransactions = recentTransactions.map(tx => ({
      id: tx._id,
      type: tx.type === 'payment' ? 'earning' : tx.type,
      description: tx.type === 'payment' 
        ? `Payment for ${tx.orderId?.serviceTitle || 'Service'}`
        : tx.type === 'payout' 
        ? 'Payout to bank account'
        : 'Refund processed',
      amount: tx.type === 'payment' ? tx.amount : -tx.amount,
      date: tx.createdAt,
      status: tx.status === 'succeeded' ? 'completed' : tx.status,
      fee: tx.type === 'payment' ? (tx.orderId?.applicationFeeAmount || 0) : 0
    }));

    console.log('[Backend] Recent transactions formatted:', formattedTransactions.length);

    // Calculate monthly earnings for chart (last 6 months)
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthOrders = await Orders.find({
        seller: sellerId,
        status: 'completed',
        'delivery.deliveredAt': { $gte: startDate, $lte: endDate }
      });
      
      const monthlyTotal = monthOrders.reduce((sum, order) => {
        return sum + (order.transferAmount || (order.price * 0.95));
      }, 0);

      monthlyEarnings.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthlyTotal
      });
    }

    console.log('[Backend] Monthly earnings calculated:', monthlyEarnings);

    const responseData = {
      availableBalance: availableBalance / 100, // Convert from cents to dollars
      pendingClearance: pendingClearance / 100,
      activeOrdersValue: activeOrdersValue / 100,
      totalEarnings: totalEarnings / 100,
      recentTransactions: formattedTransactions,
      monthlyEarnings,
      totalOrders: completedOrders.length,
      averageOrderValue: completedOrders.length > 0 ? (totalEarnings / completedOrders.length / 100) : 0
    };

    console.log('[Backend] Earnings response prepared:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Backend] Error in earnings API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}