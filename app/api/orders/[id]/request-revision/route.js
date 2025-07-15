import { connectToDB } from "@/lib/db";
import Notification from "@/models/Notification";
import Orders from "@/models/orders";

export async function PATCH(req, { params }) {
  await connectToDB();
  const order = await Orders.findByIdAndUpdate(params.id, { status: "revision_requested" }, { new: true });
   const notification = await Notification.create({
    userId: order.seller,
    type: "order",
    title: "Revision requested",
    message: "Buyer requested revision",
    actionUrl: `/orders/${order._id}`
  });
  return Response.json({ success: true, order , notification });
}
