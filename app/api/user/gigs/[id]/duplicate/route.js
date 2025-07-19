import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";

export async function POST(req, { params }) {
  console.log("[Backend] POST /api/user/gigs/[id]/duplicate - Starting request for gig:", params.id);
  
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
    const gigId = params.id;
    console.log("[Backend] Duplicating gig with ID:", gigId);

    // Find the original gig
    const originalGig = await Gigs.findOne({ 
      _id: gigId, 
      seller: user._id 
    }).lean();

    console.log("[Backend] Original gig found:", originalGig ? "Yes" : "No");

    if (!originalGig) {
      console.log("[Backend] Gig not found or access denied");
      return NextResponse.json({ 
        success: false, 
        message: "Gig not found" 
      }, { status: 404 });
    }

    // Create duplicate gig data
    const duplicateData = {
      ...originalGig,
      _id: undefined, // Remove original ID
      title: `${originalGig.title} (Copy)`,
      slug: undefined, // Will be auto-generated
      status: 'draft',
      views: 0,
      impressions: 0,
      clicks: 0,
      orders: 0,
      favorites: 0,
      ordersInQueue: 0,
      rating: {
        average: 0,
        count: 0
      },
      createdAt: new Date(),
      lastModified: new Date()
    };

    console.log("[Backend] Creating duplicate gig");

    const duplicatedGig = new Gigs(duplicateData);
    await duplicatedGig.save();

    console.log("[Backend] Gig duplicated successfully with ID:", duplicatedGig._id);

    return NextResponse.json({ 
      success: true, 
      message: "Gig duplicated successfully",
      gig: duplicatedGig 
    });

  } catch (error) {
    console.error("[Backend] Error duplicating gig:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to duplicate gig", 
      error: error.message 
    }, { status: 500 });
  }
}