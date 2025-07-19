import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";



export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/orders/[id]/submit-requirements - Starting request for order:", params.id);
  
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
    const { requirements, message, files } = await req.json();
    
    console.log("[Backend] Request data:", { 
      orderId, 
      requirementsCount: requirements?.length || 0,
      hasMessage: !!message,
      filesCount: files?.length || 0
    });

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
    if (order.status !== "awaiting_requirements") {
      console.log("[Backend] Order is not awaiting requirements, current status:", order.status);
      return NextResponse.json({ 
        success: false, 
        message: "Order is not awaiting requirements" 
      }, { status: 400 });
    }

    // Update order with requirements
    const updateData = {
      requirements: requirements || [],
      requirementsMessage: message,
      status: "active",
      lastUpdate: new Date()
    };

    // Add files if provided
    if (files && files.length > 0) {
      updateData.requirementsFiles = files;
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('seller', 'name email');

    console.log("[Backend] Order updated successfully, new status:", updatedOrder.status);

    // Create notification for seller
    const notification = await Notification.create({
      userId: updatedOrder.seller._id,
      type: "order",
      title: "Requirements Submitted",
      message: `Buyer has submitted requirements for order #${orderId.slice(-8)}. You can now start working!`,
      actionUrl: `/orders/${orderId}`,
      role: "seller"
    });

    console.log("[Backend] Notification created for seller:", notification._id);

    return NextResponse.json({ 
      success: true, 
      message: "Requirements submitted successfully",
      order: updatedOrder,
      notification
    });

  } catch (error) {
    console.error("[Backend] Error submitting requirements:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to submit requirements", 
      error: error.message 
    }, { status: 500 });
  }
}