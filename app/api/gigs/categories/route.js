import { NextResponse } from "next/server";
import Gigs from "@/models/Gigs";
import { connectToDB } from "@/lib/db";

export async function GET() {
  console.log("[Backend] GET /api/gigs/categories - Starting request");
  
  try {
    await connectToDB();
    console.log("[Backend] Connected to database");

    // Get category statistics
    const categoryStats = await Gigs.aggregate([
      { $match: { status: 'live', isAcceptingOrders: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: { $arrayElemAt: ['$packages.price', 0] } },
          avgRating: { $avg: '$rating.average' },
          totalOrders: { $sum: '$orders' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log("[Backend] Category stats calculated:", categoryStats.length);

    // Format categories with display names
    const categories = categoryStats.map(stat => ({
      value: stat._id,
      name: stat._id ? stat._id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Other',
      count: stat.count,
      avgPrice: Math.round(stat.avgPrice || 0),
      avgRating: Math.round((stat.avgRating || 0) * 10) / 10,
      totalOrders: stat.totalOrders || 0
    }));

    // Get featured gigs count
    const featuredCount = await Gigs.countDocuments({ 
      status: 'live', 
      isFeatured: true,
      isAcceptingOrders: true 
    });

    console.log("[Backend] Featured gigs count:", featuredCount);

    const response = {
      success: true,
      categories,
      featuredCount,
      totalGigs: categoryStats.reduce((sum, stat) => sum + stat.count, 0)
    };

    console.log("[Backend] Categories response prepared");

    return NextResponse.json(response);

  } catch (error) {
    console.error("[Backend] Error fetching categories:", error.message);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    }, { status: 500 });
  }
}