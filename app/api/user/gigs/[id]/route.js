
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";



export async function GET(req, { params }) {
  console.log("[Backend] GET /api/user/gigs/[id] - Starting request for gig:", params.id);
  
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
    console.log("[Backend] Fetching gig with ID:", gigId);

    const gig = await Gigs.findOne({ 
      _id: gigId, 
      seller: user._id 
    }).lean();

    console.log("[Backend] Gig found:", gig ? "Yes" : "No");

    if (!gig) {
      console.log("[Backend] Gig not found or access denied");
      return NextResponse.json({ 
        success: false, 
        message: "Gig not found" 
      }, { status: 404 });
    }

    console.log("[Backend] Gig fetched successfully");
    return NextResponse.json({ 
      success: true, 
      gig 
    });

  } catch (error) {
    console.error("[Backend] Error fetching gig:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch gig", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/user/gigs/[id] - Starting request for gig:", params.id);
  
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
    const updateData = await req.json();
    
    console.log("[Backend] Update data received:", Object.keys(updateData));

    // Handle revisions field properly (can be number or "unlimited")
    if (updateData.packages) {
      updateData.packages = updateData.packages.map(pkg => ({
        ...pkg,
        revisions: pkg.revisions === "unlimited" ? "unlimited" : parseInt(pkg.revisions) || 1
      }));
    }

    // Update lastModified
    updateData.lastModified = new Date();

    const updatedGig = await Gigs.findOneAndUpdate(
      { _id: gigId, seller: user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("[Backend] Gig updated:", updatedGig ? "Yes" : "No");

    if (!updatedGig) {
      console.log("[Backend] Gig not found or access denied");
      return NextResponse.json({ 
        success: false, 
        message: "Gig not found" 
      }, { status: 404 });
    }

    console.log("[Backend] Gig updated successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Gig updated successfully",
      gig: updatedGig 
    });

  } catch (error) {
    console.error("[Backend] Error updating gig:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update gig", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  console.log("[Backend] DELETE /api/user/gigs/[id] - Starting request for gig:", params.id);
  
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
    console.log("[Backend] Deleting gig with ID:", gigId);

    const deletedGig = await Gigs.findOneAndDelete({ 
      _id: gigId, 
      seller: user._id 
    });

    console.log("[Backend] Gig deleted:", deletedGig ? "Yes" : "No");

    if (!deletedGig) {
      console.log("[Backend] Gig not found or access denied");
      return NextResponse.json({ 
        success: false, 
        message: "Gig not found" 
      }, { status: 404 });
    }

    console.log("[Backend] Gig deleted successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Gig deleted successfully" 
    });

  } catch (error) {
    console.error("[Backend] Error deleting gig:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete gig", 
      error: error.message 
    }, { status: 500 });
  }
}