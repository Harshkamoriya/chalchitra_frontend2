import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";

export async function GET(req) {
  console.log("[Backend] GET /api/user/gigs/stats - Starting request");
  
  await connectToDB();
  console.log("[Backend] Connected to database");

  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) {
    console.log("[Backend] Authentication failed");
    return authResult;
  }

  const { user } = authResult;
  console.log("[Backend] Authenticated user:", user._id);

  // Check if user is a seller
  if (!user.isSeller) {
    console.log("[Backend] User is not a seller");
    return NextResponse.json({ 
      success: false, 
      message: "Access denied. User is not a seller." 
    }, { status: 403 });
  }

  try {
    // Get stats for each status
    const stats = await Gigs.aggregate([
      { $match: { seller: user._id } },
      { 
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log("[Backend] Raw stats from aggregation:", stats);

    // Format stats for frontend
    const formattedStats = {
      live: 0,
      draft: 0,
      pending: 0,
      requires_modification: 0,
      paused: 0,
      denied: 0
    };

    stats.forEach(stat => {
      if (formattedStats.hasOwnProperty(stat._id)) {
        formattedStats[stat._id] = stat.count;
      }
    });

    console.log("[Backend] Formatted stats:", formattedStats);

    return NextResponse.json({
      success: true,
      stats: formattedStats
    });

  } catch (error) {
    console.error("[Backend] Error fetching gig stats:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch gig stats", 
      error: error.message 
    }, { status: 500 });
  }
}