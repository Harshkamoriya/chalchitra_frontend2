import Gigs from "@/models/Gigs";
import { getServerSession } from "next-auth"
import { connectToDB } from "@/lib/db"; 
import { NextResponse } from "next/server";  

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const session = await getServerSession();
    if (!session?.user?.email)
      return NextResponse.json({
        message: "unauthorized",
        status: 401,
        success: false,
      });
const gigId = params.id;
    const data = await req.json();
    console.log("Gig ID:", gigId);
    if (!gigId)
      return NextResponse.json({
        message: "Gig ID is required",
        status: 400,
        success: false,
      });

    const gig = await Gigs.findById(gigId);
    if (!gig) {
      return NextResponse.json({
        message: "Gig not found",
        status: 404,
        success: false,
      });
    }
    const updatedGig = await Gigs.findByIdAndUpdate(gigId, data, { new: true });
    if (!updatedGig)
      return NextResponse.json({
        message: "Failed to update gig",
        status: 500,
        success: false,
      });
    return NextResponse.json({
      message: "Gig updated successfully",
      status: 200,
      success: true,
      gig: updatedGig,
    });
  } catch (error) {
    console.error("Error updating gig:", error);
    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
      success: false,
      error: error.message,
    });
  }
}

export async function GET(req , params) {
  try {
    await connectToDB();
    const session = await getServerSession();
    if (!session?.user?.email)
      return NextResponse.json({
        message: "unauthorized",
        status: 401,
        success: false,
      });
    const gig = await Gigs.findById(params.id);
    if (!gig)
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    return NextResponse.json({ gig, status: 200, success: true });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
      success: false,
      error: error.message,
    });
  }
}
