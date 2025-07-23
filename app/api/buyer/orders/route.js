import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/db"
import Orders from "@/models/orders"
import { authenticateUser } from "@/middlewares/auth"

export async function GET(req) {
  console.log("=== GET /api/buyer/orders ===")

  try {
    // Authenticate user
    const authResult = await authenticateUser(req)
    if (authResult instanceof Response) {
      console.log("Authentication failed")
      return authResult
    }

    const { user } = authResult
    console.log("Authenticated user:", user._id)

    // Check if user is a buyer
    if (!user.isbuyer) {
      console.log("User is not a buyer")
      return NextResponse.json({ error: "Access denied. Buyer only." }, { status: 403 })
    }

    await connectToDB()

    // Get URL search params for filtering
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit

    console.log("Query params - status:", status, "page:", page, "limit:", limit)

    // Build query
    const query = { buyer: user._id }
    if (status && status !== "all") {
      query.status = status
    }

    console.log("MongoDB query:", query)

    // Fetch orders with populated data
    const orders = await Orders.find(query)
      .populate("gig", "title images category")
      .populate("seller", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    console.log("Found orders count:", orders.length)

    // Get total count for pagination
    const totalOrders = await Orders.countDocuments(query)
    console.log("Total orders count:", totalOrders)

    // Calculate summary statistics
    const summaryStats = await Orders.aggregate([
      { $match: { buyer: user._id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          activeOrders: {
            $sum: { $cond: [{ $in: ["$status", ["active", "delivered", "revision"]] }, 1, 0] },
          },
        },
      },
    ])

    const stats = summaryStats[0] || {
      totalSpent: 0,
      totalOrders: 0,
      completedOrders: 0,
      activeOrders: 0,
    }

    console.log("Summary stats:", stats)

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1,
      },
      stats,
    })
  } catch (error) {
    console.error("Error fetching buyer orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
