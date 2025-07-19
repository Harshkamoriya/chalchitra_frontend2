import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/orders/[id]/accept - Starting request for order:", params.id);
  
  await connectToDB();
  console.log("[Backend] Connected to database");

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("[Backend] Authentication failed");
    return authResult;
  }

  const { user } = authResult;
  console.log("[Backend] Authenticated user:", user._id);

  try {
    const orderId = params.id;
    console.log("[Backend] Processing acceptance for order:", orderId);

    // Find the order
    const order = await Orders.findById(orderId);
    if (!order) {
      console.log("[Backend] Order not found");
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // Verify user is the buyer
    if (order.buyer.toString() !== user._id.toString()) {
      console.log("[Backend] User is not the buyer of this order");
      return NextResponse.json({ 
        success: false, 
        message: "Access denied" 
      }, { status: 403 });
    }

    // Verify order is in correct status
    if (order.status !== "delivered") {
      console.log("[Backend] Order is not delivered, current status:", order.status);
      return NextResponse.json({ 
        success: false, 
        message: "Order is not delivered" 
      }, { status: 400 });
    }

    // Update order status to completed
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { 
        status: "completed",
        lastUpdate: new Date()
      },
      { new: true }
    ).populate('seller', 'name email');

    console.log("[Backend] Order accepted successfully, new status:", updatedOrder.status);

    // Create notification for seller
    const notification = await Notification.create({
      userId: updatedOrder.seller._id,
      type: "order",
      title: "Order Completed",
      message: `Great news! Buyer has accepted your delivery for order #${orderId.slice(-8)}. Payment will be released soon.`,
      actionUrl: `/orders/${orderId}`,
      role: "seller"
    });

    console.log("[Backend] Notification created for seller:", notification._id);

    return NextResponse.json({ 
      success: true, 
      message: "Order accepted successfully",
      order: updatedOrder,
      notification
    });

  } catch (error) {
    console.error("[Backend] Error accepting order:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to accept order", 
      error: error.message 
    }, { status: 500 });
  }
}