// import Orders from "@/models/orders";
// import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/db";
// import { authenticateUser } from "@/middlewares/auth";

// export async function GET(req, { params }) {
//   await connectToDB();
//   const { user } = await authenticateUser(req);
//   if (!user) {
//     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const orderId = params.id;
//     const order = await Orders.findById(orderId);

//     if (!order) {
//       return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, order });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, message: "Failed to fetch order", error: error.message }, { status: 500 });
//   }
// }


import Orders from "@/models/orders";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";

export async function GET(req, { params }) {
  console.log("[GET /api/orders/pending_payment] Starting request for order:", params.id);
  
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
    const orderId = params.id;
    console.log("[Order] Fetching order with ID:", orderId);

    const order = await Orders.findById(orderId)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('gig', 'title description');

    if (!order) {
      console.log("[Order] Order not found");
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // Verify user is the buyer of this order
    if (order.buyer._id.toString() !== user._id.toString()) {
      console.log("[Auth] User not authorized for this order");
      return NextResponse.json({ 
        success: false, 
        message: "Not authorized to view this order" 
      }, { status: 403 });
    }

    // Only allow pending payment orders
    if (order.paymentStatus !== 'pending') {
      console.log("[Order] Order payment status is not pending:", order.paymentStatus);
      return NextResponse.json({ 
        success: false, 
        message: "Order payment already processed" 
      }, { status: 400 });
    }

    console.log("[Order] Order fetched successfully");
    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error("[Error] Failed to fetch order:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch order", 
      error: error.message 
    }, { status: 500 });
  }
}