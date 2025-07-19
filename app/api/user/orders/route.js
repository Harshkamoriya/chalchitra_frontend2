import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";

export async function GET(req) {
  console.log("[Backend] GET /api/user/orders - Starting request");

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("[Backend] Authentication failed");
    return authResult;
  }

  const { user } = authResult;
  console.log("[Backend] Authenticated user:", user._id);

  await connectToDB();
  console.log("[Backend] Connected to database");

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "buyer";
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  console.log("[Backend] Query params:", { role, status, search, page, limit });

  try {
    // Build query based on role
    const query = {};
    
    if (role === "seller") {
      query.seller = user._id;
    } else if (role === "buyer") {
      query.buyer = user._id;
    } else {
      console.log("[Backend] Invalid role specified:", role);
      return NextResponse.json({ 
        success: false, 
        message: "Invalid role specified" 
      }, { status: 400 });
    }

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Add search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { serviceTitle: searchRegex },
        { category: searchRegex },
        { note: searchRegex }
      ];
    }

    console.log("[Backend] Final MongoDB query:", JSON.stringify(query, null, 2));

    // Execute queries
    const [orders, total] = await Promise.all([
      Orders.find(query)
        .populate("buyer", "name email username avatar")
        .populate("seller", "name email username avatar")
        .populate("gig", "title category description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Orders.countDocuments(query)
    ]);

    console.log(`[Backend] Found ${orders.length} orders out of ${total} total`);

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      ...order,
      // Ensure consistent field names
      serviceTitle: order.gig?.title || order.serviceTitle || "Service",
      category: order.gig?.category || order.category || "General"
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("[Backend] Error fetching orders:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch orders", 
      error: error.message 
    }, { status: 500 });
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
      selectedPackage: body.packageType,
      amount: body.price,
      requirements: body.requirements,
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