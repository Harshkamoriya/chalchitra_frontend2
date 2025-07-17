import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { deliveryFile, deliveryMessage } = await req.json();
    const order = await Orders.findByIdAndUpdate(params.id, {
      deliveryFile,
      deliveryMessage,
      status: "delivered"
    }, { new: true });
    if (!order) return Response.json({ success: false, message: "Order not found" }, { status: 404 });

   const notification =  await Notification.create({
      userId: order.buyer,
      type: "order",
      title: "Order delivered",
      message: "Seller has delivered the work",
      actionUrl: `/orders/${order._id}`
    });
    return Response.json({ success: true, order  , notification});
  } catch (e) {
    console.error(e);
    return Response.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
