import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";

export async function PATCH(req, { params }) {
  console.log("Received star toggle request for order:", params.id);

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  try {
    const { isStarred } = await req.json();
    
    const order = await Orders.findOneAndUpdate(
      { 
        _id: params.id,
        $or: [{ seller: user._id }, { buyer: user._id }]
      },
      { 
        isStarred: isStarred,
        lastUpdate: new Date()
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    console.log("Order starred status updated:", order._id, isStarred);

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Error updating star status:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}