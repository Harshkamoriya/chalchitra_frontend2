import Orders from "@/models/orders";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";

export async function GET(req, { params }) {
  await connectToDB();
  const { user } = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orderId = params.id;
    const order = await Orders.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch order", error: error.message }, { status: 500 });
  }
}
