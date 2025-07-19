import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/orders/[id]/request-revision - Starting request for order:", params.id);
  
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
    const { revisionMessage } = await req.json();
    
    console.log("[Backend] Request data:", { 
      orderId, 
      hasMessage: !!revisionMessage
    });

    // Validate required fields
    if (!revisionMessage || !revisionMessage.trim()) {
      console.log("[Backend] Revision message is required");
      return NextResponse.json({ 
        success: false, 
        message: "Revision message is required" 
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

    // Check revision limit (if applicable)
    const maxRevisions = order.selectedPackage?.revisions || 1;
    const currentRevisions = order.revisionHistory?.length || 0;
    
    if (currentRevisions >= maxRevisions) {
      console.log("[Backend] Revision limit exceeded");
      return NextResponse.json({ 
        success: false, 
        message: "Revision limit exceeded" 
      }, { status: 400 });
    }

    // Update order with revision request
    const updateData = {
      status: "revision",
      revisionHistory: [
        ...(order.revisionHistory || []),
        {
          message: revisionMessage,
          requestedAt: new Date(),
          requestedBy: user._id
        }
      ],
      lastUpdate: new Date()
    };

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('seller', 'name email');

    console.log("[Backend] Revision requested successfully, new status:", updatedOrder.status);

    // Create notification for seller
    const notification = await Notification.create({
      userId: updatedOrder.seller._id,
      type: "order",
      title: "Revision Requested",
      message: `Buyer has requested revisions for order #${orderId.slice(-8)}. Please check the details and make necessary changes.`,
      actionUrl: `/orders/${orderId}`,
      role: "seller"
    });

    console.log("[Backend] Notification created for seller:", notification._id);

    return NextResponse.json({ 
      success: true, 
      message: "Revision requested successfully",
      order: updatedOrder,
      notification
    });

  } catch (error) {
    console.error("[Backend] Error requesting revision:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to request revision", 
      error: error.message 
    }, { status: 500 });
  }
}