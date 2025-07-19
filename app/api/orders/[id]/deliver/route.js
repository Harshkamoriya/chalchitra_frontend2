import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/orders/[id]/deliver - Starting request for order:", params.id);
  
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
    const { deliveryMessage, deliveryFiles } = await req.json();
    
    console.log("[Backend] Request data:", { 
      orderId, 
      hasMessage: !!deliveryMessage,
      filesCount: deliveryFiles?.length || 0
    });

    // Validate required fields
    if (!deliveryMessage || !deliveryMessage.trim()) {
      console.log("[Backend] Delivery message is required");
      return NextResponse.json({ 
        success: false, 
        message: "Delivery message is required" 
      }, { status: 400 });
    }

    // Find the order
    const order = await Orders.findById(orderId);
    if (!order) {
      console.log("[Backend] Order not found");
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // Verify user is the seller
    if (order.seller.toString() !== user._id.toString()) {
      console.log("[Backend] User is not the seller of this order");
      return NextResponse.json({ 
        success: false, 
        message: "Access denied" 
      }, { status: 403 });
    }

    // Verify order is in correct status
    if (order.status !== "active") {
      console.log("[Backend] Order is not active, current status:", order.status);
      return NextResponse.json({ 
        success: false, 
        message: "Order is not active" 
      }, { status: 400 });
    }

    // Update order with delivery
    const updateData = {
      delivery: {
        message: deliveryMessage,
        files: deliveryFiles || [],
        deliveredAt: new Date()
      },
      status: "delivered",
      lastUpdate: new Date()
    };

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('buyer', 'name email');

    console.log("[Backend] Order delivered successfully, new status:", updatedOrder.status);

    // Create notification for buyer
    const notification = await Notification.create({
      userId: updatedOrder.buyer._id,
      type: "order",
      title: "Order Delivered",
      message: `Your order #${orderId.slice(-8)} has been delivered. Please review and accept or request revisions.`,
      actionUrl: `/orders/${orderId}`,
      role: "buyer"
    });

    console.log("[Backend] Notification created for buyer:", notification._id);

    return NextResponse.json({ 
      success: true, 
      message: "Order delivered successfully",
      order: updatedOrder,
      notification
    });

  } catch (error) {
    console.error("[Backend] Error delivering order:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to deliver order", 
      error: error.message 
    }, { status: 500 });
  }
}