import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  try {
    await connectToDB();

    const order = await Orders.findByIdAndUpdate(
      params.id,
      { status: "completed" },
      { new: true }
    );

    if (!order) {
      return Response.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const notification = await Notification.create({
      userId: order.seller,
      type: "order",
      title: "Order completed",
      message: "Buyer accepted the delivery",
      actionUrl: `/orders/${order._id}`
    });

    return Response.json({ 
      success: true, 
      order, 
      notification   // ✅ returning the created notification
    });

  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]/complete:', error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
