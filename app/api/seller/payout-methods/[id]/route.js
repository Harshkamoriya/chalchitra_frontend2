import { NextResponse } from 'next/server';
import PayoutMethod from '@/models/PayoutMethod';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';

export async function DELETE(request, { params }) {
  try {
    console.log('[Backend] Starting delete payout method API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    const { id } = params;

    console.log('[Backend] Deleting payout method:', id);

    // Find and delete the payout method
    const payoutMethod = await PayoutMethod.findOneAndDelete({
      _id: id,
      userId
    });

    if (!payoutMethod) {
      return NextResponse.json({
        error: 'Payout method not found'
      }, { status: 404 });
    }

    console.log('[Backend] Payout method deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Payout method deleted successfully'
    });
  } catch (error) {
    console.error('[Backend] Error deleting payout method:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    console.log('[Backend] Starting update payout method API call...');
    await connectToDB();

    const authResult = await authenticateUser(request);
    if (authResult instanceof Response) {
      console.log('[Backend] Authentication failed');
      return authResult;
    }

    const { user } = authResult;
    const userId = user._id;
    const { id } = params;
    const { isDefault } = await request.json();

    console.log('[Backend] Updating payout method:', id, { isDefault });

    // If setting as default, remove default from other methods
    if (isDefault) {
      await PayoutMethod.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Update the payout method
    const payoutMethod = await PayoutMethod.findOneAndUpdate(
      { _id: id, userId },
      { isDefault },
      { new: true }
    );

    if (!payoutMethod) {
      return NextResponse.json({
        error: 'Payout method not found'
      }, { status: 404 });
    }

    console.log('[Backend] Payout method updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Payout method updated successfully',
      payoutMethod: {
        id: payoutMethod._id,
        type: payoutMethod.type,
        isDefault: payoutMethod.isDefault,
        displayName: payoutMethod.displayName,
        lastFourDigits: payoutMethod.lastFourDigits
      }
    });
  } catch (error) {
    console.error('[Backend] Error updating payout method:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}