import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/db"
import Orders from "@/models/orders"
import Transaction from "@/models/transaction"
import { authenticateUser } from "@/middlewares/auth"
export async function GET(req) {
  console.log("=== GET /api/buyer/transactions ===")

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
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 20
    const skip = (page - 1) * limit

    console.log("Query params - type:", type, "status:", status, "page:", page)

    // First, get all order IDs for this buyer
    const buyerOrders = await Orders.find({ buyer: user._id }).select("_id")
    const orderIds = buyerOrders.map((order) => order._id)

    console.log("Buyer order IDs:", orderIds.length)

    // Build transaction query
    const query = { orderId: { $in: orderIds } }

    if (type && type !== "all") {
      query.type = type
    }

    if (status && status !== "all") {
      query.status = status
    }

    console.log("Transaction query:", query)

    // Fetch transactions with populated order data
    const transactions = await Transaction.find(query)
      .populate({
        path: "orderId",
        populate: [
          { path: "gig", select: "title images" },
          { path: "seller", select: "name image" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    console.log("Found transactions count:", transactions.length)

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(query)
    console.log("Total transactions count:", totalTransactions)

    // Calculate transaction summary
    const transactionSummary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ])

    console.log("Transaction summary:", transactionSummary)

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / limit),
        totalTransactions,
        hasNext: page < Math.ceil(totalTransactions / limit),
        hasPrev: page > 1,
      },
      summary: transactionSummary,
    })
  } catch (error) {
    console.error("Error fetching buyer transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
