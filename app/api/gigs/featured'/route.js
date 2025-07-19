import { NextResponse } from "next/server";
import Gigs from "@/models/Gigs";
import { connectToDB } from "@/lib/db";

export async function GET(req) {
  console.log("[Backend] GET /api/gigs/featured - Starting request");
  
  try {
    await connectToDB();
    console.log("[Backend] Connected to database");

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    console.log("[Backend] Fetching featured gigs with limit:", limit);

    // Get featured gigs
    const featuredGigs = await Gigs.find({
      status: 'live',
      isFeatured: true,
      isAcceptingOrders: true
    })
    .populate('seller', 'name image country sellerLevel rating')
    .sort({ orders: -1, rating: -1, createdAt: -1 })
    .limit(limit)
    .lean();

    console.log(`[Backend] Found ${featuredGigs.length} featured gigs`);

    // If we don't have enough featured gigs, get popular ones
    let additionalGigs = [];
    if (featuredGigs.length < limit) {
      const remainingLimit = limit - featuredGigs.length;
      
      additionalGigs = await Gigs.find({
        status: 'live',
        isFeatured: false,
        isAcceptingOrders: true,
        _id: { $nin: featuredGigs.map(gig => gig._id) }
      })
      .populate('seller', 'name image country sellerLevel rating')
      .sort({ orders: -1, views: -1, 'rating.average': -1 })
      .limit(remainingLimit)
      .lean();

      console.log(`[Backend] Added ${additionalGigs.length} popular gigs to fill the limit`);
    }

    const allGigs = [...featuredGigs, ...additionalGigs];

    const response = {
      success: true,
      gigs: allGigs,
      featuredCount: featuredGigs.length,
      totalCount: allGigs.length
    };

    console.log("[Backend] Featured gigs response prepared");

    return NextResponse.json(response);

  } catch (error) {
    console.error("[Backend] Error fetching featured gigs:", error.message);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch featured gigs",
      error: error.message
    }, { status: 500 });
  }
}