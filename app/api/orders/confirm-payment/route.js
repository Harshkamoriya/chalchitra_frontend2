import stripe from '@/lib/stripe'; // Stripe SDK initialized with sk_test_...
import Transaction from '@/models/transaction';
import Orders from '@/models/orders';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
  }

  await connectToDB();

  try {
    const { clientSecret } = await req.json();
    console.log("[Stripe] Client secret received:", clientSecret);

    // ✅ Extract paymentIntentId from clientSecret
    const paymentIntentId = clientSecret.split('_secret_')[0];
    console.log("[Stripe] Extracted paymentIntentId:", paymentIntentId);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("[Stripe] Payment intent retrieved:", paymentIntent.id, paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Find order
      const order = await Orders.findOne({ paymentIntentId: paymentIntent.id });
      if (!order) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }

      // Update order fields
      order.paymentStatus = 'succeeded';
      order.status = 'awaiting_requirements';   // or 'in_progress' if no requirements
      order.ispaid = true;

      await order.save();

      // Create transaction
      const txn = new Transaction({
        orderId: order._id,
        type: 'payment',
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
      });
      await txn.save();

      return NextResponse.json({ 
        success: true, 
        message: "Payment confirmed and order updated.",
        order,
        transaction: txn   // return txn with key 'transaction' to match frontend
      });
    } else {
      return NextResponse.json({ success: false, message: "Payment not completed yet" }, { status: 400 });
    }

  } catch (error) {
    console.error("[Stripe Confirm Payment Error]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
