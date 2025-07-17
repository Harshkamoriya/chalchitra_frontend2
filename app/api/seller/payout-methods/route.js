import { NextResponse } from 'next/server';
import PayoutMethod from '@/models/PayoutMethod';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function GET(request) {
  try {
    console.log('[Backend] Starting payout methods API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    console.log('[Backend] Authenticated user:', userId);

    // Get all payout methods for the user
    const payoutMethods = await PayoutMethod.find({ 
      userId, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });

    console.log('[Backend] Payout methods found:', payoutMethods.length);

    // Format payout methods for frontend
    const formattedMethods = payoutMethods.map(method => ({
      id: method._id,
      type: method.type,
      isDefault: method.isDefault,
      displayName: method.displayName,
      lastFourDigits: method.lastFourDigits,
      createdAt: method.createdAt,
      details: method.type === 'bank_account' ? {
        bankName: method.bankDetails?.bankName,
        accountType: method.bankDetails?.accountType,
      } : method.type === 'paypal' ? {
        email: method.paypalDetails?.email,
      } : {
        isVerified: method.stripeDetails?.isVerified,
      }
    }));

    return NextResponse.json({
      success: true,
      payoutMethods: formattedMethods
    });
  } catch (error) {
    console.error('[Backend] Error in payout methods API:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('[Backend] Starting add payout method API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    console.log('[Backend] Authenticated user:', userId);

    const { type, bankDetails, paypalDetails, isDefault } = await request.json();

    console.log('[Backend] Adding payout method:', { type, isDefault });

    // If this is set as default, remove default from other methods
    if (isDefault) {
      await PayoutMethod.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Create display name and last four digits
    let displayName = '';
    let lastFourDigits = '';

    if (type === 'bank_account') {
      displayName = `${bankDetails.bankName} - ${bankDetails.accountType}`;
      lastFourDigits = bankDetails.accountNumber.slice(-4);
    } else if (type === 'paypal') {
      displayName = 'PayPal';
      lastFourDigits = paypalDetails.email.slice(-4);
    }

    // Create new payout method
    const payoutMethod = new PayoutMethod({
      userId,
      type,
      isDefault: isDefault || false,
      bankDetails: type === 'bank_account' ? bankDetails : undefined,
      paypalDetails: type === 'paypal' ? paypalDetails : undefined,
      displayName,
      lastFourDigits
    });

    await payoutMethod.save();

    console.log('[Backend] Payout method created:', payoutMethod._id);

    return NextResponse.json({
      success: true,
      message: 'Payout method added successfully',
      payoutMethod: {
        id: payoutMethod._id,
        type: payoutMethod.type,
        isDefault: payoutMethod.isDefault,
        displayName: payoutMethod.displayName,
        lastFourDigits: payoutMethod.lastFourDigits
      }
    });
  } catch (error) {
    console.error('[Backend] Error adding payout method:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}