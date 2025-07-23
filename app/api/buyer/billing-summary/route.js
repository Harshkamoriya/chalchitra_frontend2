import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/db"
import Orders from "@/models/orders"
import Transaction from "@/models/transaction"
import { authenticateUser } from "@/middlewares/auth"




export async function GET(req) {
  console.log("=== GET /api/buyer/billing-summary ===")

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

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    console.log("Date ranges - This month:", startOfMonth, "Last month:", startOfLastMonth, "to", endOfLastMonth)

    // Get buyer's order IDs
    const buyerOrders = await Orders.find({ buyer: user._id }).select("_id")
    const orderIds = buyerOrders.map((order) => order._id)

    console.log("Processing", orderIds.length, "orders for billing summary")

    // Overall statistics
    const overallStats = await Orders.aggregate([
      { $match: { buyer: user._id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$price" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ])

    // This month spending
    const thisMonthStats = await Orders.aggregate([
      {
        $match: {
          buyer: user._id,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlySpent: { $sum: "$price" },
          monthlyOrders: { $sum: 1 },
        },
      },
    ])

    // Last month spending
    const lastMonthStats = await Orders.aggregate([
      {
        $match: {
          buyer: user._id,
          createdAt: {
            $gte: startOfLastMonth,
            $lte: endOfLastMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          lastMonthSpent: { $sum: "$price" },
          lastMonthOrders: { $sum: 1 },
        },
      },
    ])

    // Yearly spending
    const yearlyStats = await Orders.aggregate([
      {
        $match: {
          buyer: user._id,
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: null,
          yearlySpent: { $sum: "$price" },
          yearlyOrders: { $sum: 1 },
        },
      },
    ])

    // Monthly spending trend (last 6 months)
    const monthlyTrend = await Orders.aggregate([
      {
        $match: {
          buyer: user._id,
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          spent: { $sum: "$price" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    // Category-wise spending
    const categorySpending = await Orders.aggregate([
      { $match: { buyer: user._id } },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$price" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ])

    // Recent transactions
    const recentTransactions = await Transaction.find({
      orderId: { $in: orderIds },
    })
      .populate({
        path: "orderId",
        populate: [
          { path: "gig", select: "title" },
          { path: "seller", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(5)

    console.log("Aggregation results computed")

    const summary = {
      overall: overallStats[0] || { totalSpent: 0, totalOrders: 0, avgOrderValue: 0, completedOrders: 0 },
      thisMonth: thisMonthStats[0] || { monthlySpent: 0, monthlyOrders: 0 },
      lastMonth: lastMonthStats[0] || { lastMonthSpent: 0, lastMonthOrders: 0 },
      yearly: yearlyStats[0] || { yearlySpent: 0, yearlyOrders: 0 },
      monthlyTrend,
      categorySpending,
      recentTransactions,
    }

    console.log("Billing summary prepared:", {
      totalSpent: summary.overall.totalSpent,
      totalOrders: summary.overall.totalOrders,
      thisMonthSpent: summary.thisMonth.monthlySpent,
    })

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error) {
    console.error("Error fetching billing summary:", error)
    return NextResponse.json({ error: "Failed to fetch billing summary" }, { status: 500 })
  }
}
