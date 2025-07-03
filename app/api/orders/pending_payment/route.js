// /app/api/orders/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import { authenticateUser } from "@/middlewares/auth";

export async function POST(req) {
  try {
    await connectToDB();
    const {user} = await authenticateUser(req);
    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

    const body = await req.json();
    console.log("Received body:", body);    
    const {
      gigId, sellerId, buyerId, selectedPackage, requirements, addons, price
    } = body;

    const totalprice = selectedPackage.price + (addons?.reduce((acc, addon) => acc + addon.price, 0) || 0);

    const duedate = Date.now() + selectedPackage.deliveryTime * 24 * 60 * 60 * 1000; // Convert delivery time to milliseconds

    const newOrder = await Orders.create({
      gig: gigId,
      seller: sellerId,
      buyer: buyerId,
      selectedPackage: selectedPackage,
      requirements,
      addons,
      price,
      status: "pending",
      paymentStatus: "pending",
      dueDate:duedate
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
  }
}

