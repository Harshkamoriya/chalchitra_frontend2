import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { message, requirementsFile } = await req.json();
    const order = await Orders.findByIdAndUpdate(params.id, {
      requirementsMessage: message,
      requirementsFile,
      status: "active"
    }, { new: true });
    if (!order) return Response.json({ success: false, message: "Order not found" }, { status: 404 });

     const notification = await Notification.create({
      userId: order.seller,
      type: "order",
      title: "Buyer submitted requirements",
      message: "You can start working!",
      actionUrl: `/orders/${order._id}`
    });
    return Response.json({ success: true, order , notification });
  } catch (e) {
    console.error(e);
    return Response.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}
