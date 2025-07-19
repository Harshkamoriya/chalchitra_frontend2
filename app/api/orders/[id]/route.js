import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import Gigs from "@/models/Gigs";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

// GET /api/orders/[id]
export async function GET(req, { params }) {
  try {
    await connectToDB();
    console.log("[Backend] Connected to database");
   
     const authResult = await authenticateUser(req);
     if (authResult instanceof Response) {
       console.log("[Backend] Authentication failed");
       return authResult;
     }
   
     const { user } = authResult;
     console.log("[Backend] Authenticated user:", user._id);

    const orderId = params.id;

    const order = await Orders.findById(orderId)
      .populate({
        path: "gig",
        model: Gigs,
        select: "title requirements questions",
      })
      .populate({
        path: "buyer",
        model: User,
        select: "name email image",
      })
      .populate({
        path: "seller",
        model: User,
        select: "name email image",
      });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching order details:", error);
    return NextResponse.json({ success: false, message: "Server error while fetching order" }, { status: 500 });
  }
}
