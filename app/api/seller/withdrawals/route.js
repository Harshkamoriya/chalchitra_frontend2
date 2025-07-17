import { NextResponse } from 'next/server';
import Withdrawal from '@/models/Withdrwal';
import PayoutMethod from '@/models/PayoutMethod';
import Orders from '@/models/orders';
import Transaction from '@/models/transaction';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting withdrawals API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    console.log('[Backend] Authenticated user:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get withdrawals with pagination
    const withdrawals = await Withdrawal.find({ userId })
      .populate('payoutMethodId', 'type displayName lastFourDigits')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('[Backend] Withdrawals found:', withdrawals.length);

    // Get total count for pagination
    const totalCount = await Withdrawal.countDocuments({ userId });

    // Format withdrawals for frontend
    const formattedWithdrawals = withdrawals.map(withdrawal => ({
      id: withdrawal._id,
      amount: withdrawal.amount / 100, // Convert from cents to dollars
      netAmount: withdrawal.netAmount / 100,
      processingFee: withdrawal.processingFee / 100,
      status: withdrawal.status,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      completedAt: withdrawal.completedAt,
      payoutMethod: {
        type: withdrawal.payoutMethodId?.type,
        displayName: withdrawal.payoutMethodId?.displayName,
        lastFourDigits: withdrawal.payoutMethodId?.lastFourDigits
      },
      failureReason: withdrawal.failureReason,
      notes: withdrawal.notes
    }));

    return NextResponse.json({
      success: true,
      withdrawals: formattedWithdrawals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('[Backend] Error in withdrawals API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('[Backend] Starting withdrawal request API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    console.log('[Backend] Authenticated user:', userId);

    const { amount, payoutMethodId, notes } = await request.json();

    console.log('[Backend] Withdrawal request:', { amount, payoutMethodId });

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({
        error: 'Invalid withdrawal amount'
      }, { status: 400 });
    }

    // Check if payout method exists and belongs to user
    const payoutMethod = await PayoutMethod.findOne({
      _id: payoutMethodId,
      userId,
      isActive: true
    });

    if (!payoutMethod) {
      return NextResponse.json({
        error: 'Invalid payout method'
      }, { status: 400 });
    }

    // Calculate available balance
    const now = new Date();
    const clearanceDate = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000)); // 14 days ago

    const availableOrders = await Orders.find({
      seller: userId,
      status: 'completed',
      'delivery.deliveredAt': { $lte: clearanceDate },
      payoutStatus: { $ne: 'paid' }
    });

    const availableBalance = availableOrders.reduce((sum, order) => {
      return sum + (order.transferAmount || (order.price * 0.95)); // 5% platform fee
    }, 0);

    console.log('[Backend] Available balance:', availableBalance / 100);

    // Check if user has sufficient balance
    const requestedAmountCents = Math.round(amount * 100);
    if (requestedAmountCents > availableBalance) {
      return NextResponse.json({
        error: 'Insufficient available balance'
      }, { status: 400 });
    }

    // Calculate processing fee (2.5% of withdrawal amount)
    const processingFee = Math.round(requestedAmountCents * 0.025);
    const netAmount = requestedAmountCents - processingFee;

    // Create withdrawal record
    const withdrawal = new Withdrawal({
      userId,
      payoutMethodId,
      amount: requestedAmountCents,
      processingFee,
      netAmount,
      status: 'pending',
      orderIds: availableOrders.slice(0, Math.ceil(requestedAmountCents / (availableBalance / availableOrders.length))).map(o => o._id),
      notes
    });

    await withdrawal.save();

    // Create transaction record
    const transaction = new Transaction({
      type: 'payout',
      amount: -requestedAmountCents, // Negative for outgoing
      status: 'pending'
    });

    await transaction.save();

    // Update order payout status for the withdrawn amount
    let remainingAmount = requestedAmountCents;
    for (const order of availableOrders) {
      if (remainingAmount <= 0) break;
      
      const orderAmount = order.transferAmount || (order.price * 0.95);
      if (remainingAmount >= orderAmount) {
        await Orders.findByIdAndUpdate(order._id, { payoutStatus: 'paid' });
        remainingAmount -= orderAmount;
      }
    }

    console.log('[Backend] Withdrawal request created:', withdrawal._id);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount / 100,
        netAmount: withdrawal.netAmount / 100,
        processingFee: withdrawal.processingFee / 100,
        status: withdrawal.status,
        requestedAt: withdrawal.requestedAt
      }
    });
  } catch (error) {
    console.error('[Backend] Error creating withdrawal:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}