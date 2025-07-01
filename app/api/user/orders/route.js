import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
export async function GET(req) {
  console.log("Received request:", req.url);

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("Authentication failed: returning response");
    return authResult;
  }

  const { user } = authResult;
  if (!user) {
    console.log("No user found after authentication");
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  console.log("Authenticated user:", user._id);

  await connectToDB();
  console.log("Connected to DB");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const role = searchParams.get("role") || "seller";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  console.log("Parsed query params:", { status, role, page, limit, skip });

  try {
    const query = {};

    if (role === "seller") {
      query.seller = user._id;
    } else if (role === "buyer") {
      query.buyer = user._id;
    }

    if (status) {
      query.status = status;
    }

    console.log("Final MongoDB query:", query);

    const [orders, total] = await Promise.all([
      Orders.find(query)
        .populate("buyer", "name avatar username")
        .populate("gig", "title category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Orders.countDocuments(query)
    ]);

    console.log(`Fetched ${orders.length} orders. Total matching orders: ${total}`);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  console.log("Received POST request:", req.url);

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("Authentication failed: returning response");
    return authResult;
  }

  const { user } = authResult;
  if (!user) {
    console.log("No user found after authentication");
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  console.log("Authenticated user:", user._id);

  try {
    const body = await req.json();
    console.log("Request body:", body);

    // Validate required fields
    if (!body.gigId || !body.packageType || !body.price || !body.requirements || !body.dueDate) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Create new order
    const newOrder = new Orders({
      gig: body.gigId,
      buyer: user._id,
      seller: body.sellerId, // Assuming sellerId is passed in the request
      packageType: body.packageType,
      price: body.price,
      requirements: body.requirements,
      note: body.note || "",
      dueDate: new Date(body.dueDate),
      status: "pending"
    });

    await newOrder.save();
    console.log("New order created:", newOrder._id);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}