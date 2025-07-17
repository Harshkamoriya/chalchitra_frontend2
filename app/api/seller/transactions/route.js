import { NextResponse } from 'next/server';
import Orders from '@/models/orders';
import Transaction from '@/models/transaction';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting transactions API call...');
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
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Get seller's order IDs
    const sellerOrders = await Orders.find({ seller: sellerId }).distinct('_id');
    console.log('[Backend] Seller orders found:', sellerOrders.length);

    // Build query for transactions
    let query = {
      orderId: { $in: sellerOrders }
    };

    // Add type filter if not 'all'
    if (type !== 'all') {
      query.type = type;
    }

    console.log('[Backend] Transaction query built:', query);

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .populate('orderId', 'serviceTitle price buyer gig')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('[Backend] Transactions found:', transactions.length);

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(query);

    // Format transactions for frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx._id,
      type: tx.type,
      description: getTransactionDescription(tx),
      amount: formatTransactionAmount(tx),
      date: tx.createdAt,
      status: tx.status === 'succeeded' ? 'completed' : tx.status,
      fee: tx.type === 'payment' ? (tx.orderId?.applicationFeeAmount || 0) / 100 : 0,
      orderId: tx.orderId?._id,
      serviceTitle: tx.orderId?.serviceTitle || 'Service',
      paymentIntentId: tx.paymentIntentId
    }));

    console.log('[Backend] Transactions formatted:', formattedTransactions.length);

    const responseData = {
      transactions: formattedTransactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    };

    console.log('[Backend] Transaction response prepared');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Backend] Error in transactions API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

// Helper functions
function getTransactionDescription(tx) {
  switch (tx.type) {
    case 'payment':
      return `Payment received for ${tx.orderId?.serviceTitle || 'Service'}`;
    case 'payout':
      return 'Payout to bank account';
    case 'refund':
      return `Refund processed for ${tx.orderId?.serviceTitle || 'Service'}`;
    default:
      return 'Transaction';
  }
}

function formatTransactionAmount(tx) {
  const amount = tx.amount / 100; // Convert from cents to dollars
  
  switch (tx.type) {
    case 'payment':
      return amount; // Positive for earnings
    case 'payout':
      return -amount; // Negative for payouts
    case 'refund':
      return -amount; // Negative for refunds
    default:
      return amount;
  }
}