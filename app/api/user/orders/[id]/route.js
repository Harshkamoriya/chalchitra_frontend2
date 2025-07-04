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
  const sort = searchParams.get("sort") || "dueDate";
  const starred = searchParams.get("starred");
  const skip = (page - 1) * limit;

  console.log("Parsed query params:", { status, role, page, limit, skip, sort, starred });

  try {
    const query = {};

    if (role === "seller") {
      query.seller = user._id;
    } else if (role === "buyer") {
      query.buyer = user._id;
    }

    // Handle status filtering
    if (status) {
      if (status.includes(',')) {
        // Multiple statuses (e.g., "in_progress,pending,awaiting_requirements")
        query.status = { $in: status.split(',') };
      } else {
        query.status = status;
      }
    }

    // Handle starred filter
    if (starred === "true") {
      query.isStarred = true;
    }

    console.log("Final MongoDB query:", query);

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case "amount":
        sortObj = { price: -1 };
        break;
      case "recent":
        sortObj = { createdAt: -1 };
        break;
      case "dueDate":
      default:
        sortObj = { dueDate: 1 };
        break;
    }

    const [orders, total] = await Promise.all([
      Orders.find(query)
        .populate("buyer", "name image username email")
        .populate("gig", "title category")
        .sort(sortObj)
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