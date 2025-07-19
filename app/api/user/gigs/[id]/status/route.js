import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";

export async function PATCH(req, { params }) {
  console.log("[Backend] PATCH /api/user/gigs/[id]/status - Starting request for gig:", params.id);
  
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
    const { status } = await req.json();
    
    console.log("[Backend] Changing status to:", status);

    // Validate status
    const validStatuses = ['live', 'paused', 'draft'];
    if (!validStatuses.includes(status)) {
      console.log("[Backend] Invalid status provided:", status);
      return NextResponse.json({ 
        success: false, 
        message: "Invalid status" 
      }, { status: 400 });
    }

    const updatedGig = await Gigs.findOneAndUpdate(
      { _id: gigId, seller: user._id },
      { 
        $set: { 
          status: status,
          lastModified: new Date()
        }
      },
      { new: true }
    );

    console.log("[Backend] Gig status updated:", updatedGig ? "Yes" : "No");

    if (!updatedGig) {
      console.log("[Backend] Gig not found or access denied");
      return NextResponse.json({ 
        success: false, 
        message: "Gig not found" 
      }, { status: 404 });
    }

    console.log("[Backend] Gig status updated successfully to:", status);
    return NextResponse.json({ 
      success: true, 
      message: `Gig ${status === 'paused' ? 'paused' : 'activated'} successfully`,
      gig: updatedGig 
    });

  } catch (error) {
    console.error("[Backend] Error updating gig status:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update gig status", 
      error: error.message 
    }, { status: 500 });
  }
}