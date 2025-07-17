// import { connectToDB } from "@/lib/db";
// import { authenticateUser } from "@/middlewares/auth";
// import Orders from "@/models/orders";
// import { NextResponse } from "next/server";
// import User from "@/models/user";
// import stripe from "@/lib/stripe"; // make sure your Stripe instance is imported

// export async function POST(req) {
//   console.log("[POST /api/stripe/create-payment] Starting request");

//   await connectToDB();
//   console.log("[DB] Connected");

//   const { user } = await authenticateUser(req);
//   console.log("[Auth] Authenticated user:", user?._id);

//   if (!user) {
//     console.log("[Auth] Unauthorized access");
//     return NextResponse.json({
//       success: false,
//       message: "Unauthorized",
//       status: 401
//     });
//   }

//   try {
//     const { orderId } = await req.json();
//     console.log("[Request Body] orderId:", orderId);

//     const order = await Orders.findById(orderId);
//     console.log("[DB] Fetched order:", order?._id);

//     if (!order) {
//       console.log("[Order] Order not found");
//       return NextResponse.json({
//         success: false,
//         status: 404,
//         message: "Order not found"
//       });
//     }

//     // assuming you have a User model imported if you do this
//     // but here you are trying to use user.findById; should be User.findById
//     // import User from "@/models/User";
//     // const seller = await User.findById(order.seller);

//     console.log("[Order] Seller ID:", order.seller);

//     const seller = await User.findById(order.seller); // <- this likely should be User.findById
//     console.log("[DB] Fetched seller:", seller?._id);

//     if (!seller?.stripeAccountId) {
//       console.log("[Stripe] Seller not onboarded (no stripeAccountId)");
//       return NextResponse.json(
//         { success: false, message: "Seller not onboarded" },
//         { status: 400 }
//       );
//     }

//     const fee = Math.round(order.price * 0.2 * 100);
//     const transferAmount = order.price * 100 - fee;
//     console.log("[Payment] Calculated fee:", fee, " transferAmount:", transferAmount);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: order.price * 100,
//       currency: 'usd',
//       application_fee_amount: fee,
//       transfer_data: { destination: seller.stripeAccountId },
//       metadata: { orderId: order._id.toString() }
//     });

//     console.log("[Stripe] Created paymentIntent:", paymentIntent.id);

//     order.paymentIntentId = paymentIntent.id;
//     order.applicationFeeAmount = fee;
//     order.transferAmount = transferAmount;
//     await order.save();

//     console.log("[Order] Updated order with paymentIntentId and saved");

//     return NextResponse.json({
//       success: true,
//       message: "Transaction successful",
//       status: 201,
//       clientSecret: paymentIntent.client_secret
//     });

//   } catch (error) {
//     console.error("[Error] Payment processing failed:", error.message);
//     return NextResponse.json({
//       success: false,
//       status: 500,
//       message: "Payment processing failed",
//       error: error.message
//     });
//   }
// // }
// import { connectToDB } from "@/lib/db";
// import { authenticateUser } from "@/middlewares/auth";
// import Orders from "@/models/orders";
// import { NextResponse } from "next/server";
// import stripe from "@/lib/stripe";

// export async function POST(req) {
//   console.log("[POST /api/stripe/create-payment] Starting request");

//   await connectToDB();
//   console.log("[DB] Connected");

//   const { user } = await authenticateUser(req);
//   console.log("[Auth] Authenticated user:", user?._id);

//   if (!user) {
//     console.log("[Auth] Unauthorized access");
//     return NextResponse.json({
//       success: false,
//       message: "Unauthorized",
//       status: 401
//     });
//   }

//   try {
//     const { orderId } = await req.json();
//     console.log("[Request Body] orderId:", orderId);

//     const order = await Orders.findById(orderId);
//     console.log("[DB] Fetched order:", order?._id);

//     if (!order) {
//       console.log("[Order] Order not found");
//       return NextResponse.json({
//         success: false,
//         status: 404,
//         message: "Order not found"
//       });
//     }

//     let paymentIntent;

//     // ✅ Check if paymentIntentId already exists
//     if (order.paymentIntentId) {
//       console.log("[Payment] PaymentIntent already exists:", order.paymentIntentId);
//       // Retrieve existing PaymentIntent from Stripe to get client_secret
//       paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
//     } else {
//       // Create new PaymentIntent
//       const fee = Math.round(order.price * 0.2 * 100); // your platform fee
//       const amount = order.price * 100;
//       console.log("[Payment] Calculated fee:", fee, " total amount:", amount);

//       paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: 'usd',
//         metadata: { orderId: order._id.toString(), fee: fee }
//       });

//       console.log("[Stripe] Created paymentIntent:", paymentIntent.id);

//       // Save IDs and amounts to DB
//       order.paymentIntentId = paymentIntent.id;
//       order.applicationFeeAmount = fee;
//       order.transferAmount = amount - fee;
//       await order.save();

//       console.log("[Order] Updated order with paymentIntentId and saved");
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Transaction ready",
//       status: 201,
//       clientSecret: paymentIntent.client_secret
//     });

//   } catch (error) {
//     console.error("[Error] Payment processing failed:", error.message);
//     return NextResponse.json({
//       success: false,
//       status: 500,
//       message: "Payment processing failed",
//       error: error.message
//     });
//   }
// }

import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(req) {
  console.log("[POST /api/stripe/create-payment] Starting request");

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
    const { orderId } = await req.json();
    console.log("[Request] Processing order ID:", orderId);

    if (!orderId) {
      console.log("[Validation] Order ID is required");
      return NextResponse.json({
        success: false,
        message: "Order ID is required"
      }, { status: 400 });
    }

    const order = await Orders.findById(orderId);
    console.log("[Order] Fetched order:", order?._id);

    if (!order) {
      console.log("[Order] Order not found");
      return NextResponse.json({
        success: false,
        message: "Order not found"
      }, { status: 404 });
    }

    // Verify user is the buyer
    if (order.buyer.toString() !== user._id.toString()) {
      console.log("[Auth] User not authorized for this order");
      return NextResponse.json({
        success: false,
        message: "Not authorized for this order"
      }, { status: 403 });
    }

    // Check if order is in correct state
    if (order.paymentStatus !== 'pending') {
      console.log("[Order] Order payment already processed:", order.paymentStatus);
      return NextResponse.json({
        success: false,
        message: "Order payment already processed"
      }, { status: 400 });
    }

    let paymentIntent;

    // Check if paymentIntentId already exists and is valid
    if (order.paymentIntentId) {
      console.log("[Payment] Checking existing PaymentIntent:", order.paymentIntentId);
      
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        console.log("[Payment] Retrieved existing PaymentIntent status:", paymentIntent.status);
        
        // If payment intent is in a final state, create a new one
        if (['succeeded', 'canceled'].includes(paymentIntent.status)) {
          console.log("[Payment] PaymentIntent in final state, creating new one");
          paymentIntent = null;
        }
      } catch (error) {
        console.log("[Payment] Error retrieving PaymentIntent, creating new one:", error.message);
        paymentIntent = null;
      }
    }

    // Create new PaymentIntent if needed
    if (!paymentIntent) {
      console.log("[Payment] Creating new PaymentIntent");
      
      const applicationFee = Math.round(order.price * 0.05 * 100); // 5% platform fee
      const amount = Math.round(order.price * 100); // Convert to cents
      
      console.log("[Payment] Calculated amounts - Total:", amount, "Fee:", applicationFee);

      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        metadata: { 
          orderId: order._id.toString(),
          buyerId: user._id.toString(),
          sellerId: order.seller.toString()
        },
        description: `Payment for order ${order._id}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("[Stripe] Created new PaymentIntent:", paymentIntent.id);

      // Update order with payment intent details
      order.paymentIntentId = paymentIntent.id;
      order.applicationFeeAmount = applicationFee;
      order.transferAmount = amount - applicationFee;
      await order.save();

      console.log("[Order] Updated order with PaymentIntent details");
    }

    return NextResponse.json({
      success: true,
      message: "Payment intent ready",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error("[Error] Payment processing failed:", error.message);
    return NextResponse.json({
      success: false,
      message: "Payment processing failed",
      error: error.message
    }, { status: 500 });
  }
}