// import stripe from '@/lib/stripe'; // Stripe SDK initialized with sk_test_...
// import Transaction from '@/models/transaction';
// import Orders from '@/models/orders';
// import { connectToDB } from '@/lib/db';
// import { authenticateUser } from '@/middlewares/auth';
// import { NextResponse } from 'next/server';

// export async function PATCH(req) {
//   const { user } = await authenticateUser(req);
//   if (!user) {
//     return NextResponse.json({ success: false, message: "User not authorized" }, { status: 401 });
//   }

//   await connectToDB();

//   try {
//     const { clientSecret } = await req.json();
//     console.log("[Stripe] Client secret received:", clientSecret);

//     // ✅ Extract paymentIntentId from clientSecret
//     const paymentIntentId = clientSecret.split('_secret_')[0];
//     console.log("[Stripe] Extracted paymentIntentId:", paymentIntentId);

//     // Retrieve payment intent from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//     console.log("[Stripe] Payment intent retrieved:", paymentIntent.id, paymentIntent.status);

//     if (paymentIntent.status === 'succeeded') {
//       // Find order
//       const order = await Orders.findOne({ paymentIntentId: paymentIntent.id });
//       console.log(order , "order if found")
//       if (!order) {
//         return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
//       }

//       // Update order fields
//       order.paymentStatus = 'succeeded';
//       order.status = 'awaiting_requirements';   // or 'in_progress' if no requirements
//       order.ispaid = true;

//       await order.save();

//       // Create transaction
//       const txn = new Transaction({
//         orderId: order._id,
//         type: 'payment',
//         paymentIntentId: paymentIntent.id,
//         amount: paymentIntent.amount,
//         currency: paymentIntent.currency,
//         status: 'succeeded',
//       });
//       await txn.save();

//       return NextResponse.json({ 
//         success: true, 
//         message: "Payment confirmed and order updated.",
//         order,
//         transaction: txn   // return txn with key 'transaction' to match frontend
//       });
//     } else {
//       return NextResponse.json({ success: false, message: "Payment not completed yet" }, { status: 400 });
//     }

//   } catch (error) {
//     console.error("[Stripe Confirm Payment Error]", error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }
import stripe from '@/lib/stripe';
import Transaction from '@/models/transaction';
import Orders from '@/models/orders';
import { connectToDB } from '@/lib/db';
import { authenticateUser } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  console.log("[PATCH /api/orders/confirm-payment] Starting request");

  await connectToDB();
  console.log("[DB] Connected successfully");

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("[Auth] Authentication failed");
    return authResult;
  }

  const { user } = authResult;
  console.log("[Auth] Authenticated user:", user._id);

  try {
    const { clientSecret } = await req.json();
    console.log("[Request] Client secret received");

    if (!clientSecret) {
      console.log("[Validation] Client secret is required");
      return NextResponse.json({ 
        success: false, 
        message: "Client secret is required" 
      }, { status: 400 });
    }

    // Extract paymentIntentId from clientSecret
    const paymentIntentId = clientSecret.split('_secret_')[0];
    console.log("[Payment] Extracted PaymentIntent ID:", paymentIntentId);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("[Stripe] PaymentIntent status:", paymentIntent.status);

    if (paymentIntent.status !== 'succeeded') {
      console.log("[Payment] Payment not completed, status:", paymentIntent.status);
      return NextResponse.json({ 
        success: false, 
        message: "Payment not completed yet" 
      }, { status: 400 });
    }

    // Find order by paymentIntentId
    const order = await Orders.findOne({ paymentIntentId: paymentIntent.id })
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('gig', 'title description');

    if (!order) {
      console.log("[Order] Order not found for PaymentIntent:", paymentIntent.id);
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }

    // Verify user is the buyer
    if (order.buyer._id.toString() !== user._id.toString()) {
      console.log("[Auth] User not authorized for this order");
      return NextResponse.json({ 
        success: false, 
        message: "Not authorized for this order" 
      }, { status: 403 });
    }

    // Check if order is already processed
    if (order.paymentStatus === 'succeeded') {
      console.log("[Order] Order already processed, returning existing data");
      
      // Find existing transaction
      const existingTransaction = await Transaction.findOne({ 
        orderId: order._id, 
        type: 'payment' 
      });

      return NextResponse.json({ 
        success: true, 
        message: "Payment already confirmed",
        order,
        transaction: existingTransaction
      });
    }

    // Update order status
    order.paymentStatus = 'succeeded';
    order.status = 'awaiting_requirements';
    order.ispaid = true;
    order.lastUpdate = new Date();
    await order.save();

    console.log("[Order] Order updated successfully");

    // Create transaction record
    const transaction = new Transaction({
      orderId: order._id,
      type: 'payment',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      status: 'succeeded',
    });
    await transaction.save();

    console.log("[Transaction] Transaction record created:", transaction._id);

    return NextResponse.json({ 
      success: true, 
      message: "Payment confirmed and order updated",
      order,
      transaction
    });

  } catch (error) {
    console.error("[Error] Payment confirmation failed:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Payment confirmation failed",
      error: error.message 
    }, { status: 500 });
  }
}