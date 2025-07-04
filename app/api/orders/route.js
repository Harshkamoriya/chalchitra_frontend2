// import { connectToDB } from "@/lib/db";
// import { authenticateUser } from "@/middlewares/auth";
// import Orders from "@/models/orders";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await connectToDB();
  
//   const { user } = await authenticateUser(req);
//   if (!user) {
//     return NextResponse.json({ success: false, message: "User not authorized", status: 401 });
//   }

//   try {
//     let orders;

//     const role = user?.role;

//     if (role === "seller") {
//       // Find orders where this user is seller
//       orders = await Orders.find({ seller: user._id }).sort({ createdAt: -1 });
//     } else if (role === "buyer") {
//       // Find orders where this user is buyer
//       orders = await Orders.find({ buyer: user._id }).sort({ createdAt: -1 });
//     } else {
//       return NextResponse.json({ success: false, message: "Invalid role", status: 400 });
//     }

//     return NextResponse.json({
//       success: true,
//       orders,
//       status: 200
//     });

//   } catch (error) {
//     console.error("[GET ORDERS ERROR]", error);
//     return NextResponse.json({
//       success: false,
//       message: "Something went wrong while fetching orders",
//       status: 500
//     });
//   }
// }

import { connectToDB } from "@/lib/db";
import Orders from "@/models/orders";
import { NextResponse } from "next/server";


export async function GET() {
  await connectToDB();
  const orders = await Orders.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, orders, status: 200 });
}

export async function POST(req) {
  await connectToDB();

  try {
    const body = await req.json();

    // Create and save the new order
    const newOrder = await Orders.create(body);

    return Response.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders] Error creating order:", error);

    return Response.json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    }, { status: 500 });
  }
}




