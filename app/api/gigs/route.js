import { NextResponse } from "next/server";
import Gigs from "@/models/Gigs";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";

// /app/api/gig/route.js (for POST - create new gig)



// export async function POST(req) {
//   await connectToDB()

//   const authResult = await authenticateUser(req)
//   if (authResult instanceof Response) return authResult

//   const {user} = authResult
//   if (!user) {
//     return NextResponse.json({ success: false, message: "Unauthorized user", status: 401 })
//   }

//   try {
//     const body = await req.json()
//     console.log(body, " body of gig");

//     const newGig = new Gigs({
//       ...body,
//       seller: user._id,
//       status: body.status || "draft",
//     })

//     const savedGig = await newGig.save()

//     return NextResponse.json({ success: true, message: "Gig created", status: 201, gig: savedGig })
//   } catch (err) {
//     console.error("Gig creation error:", err)
//     return NextResponse.json({ success: false, message: "Failed to create gig", status: 500 })
//   }
// }


export async function GET() {
  try {
    await connectToDB();
    const gigs = await Gigs.find({});
    console.log(gigs, "where are the gigs");
    if (!gigs) {
      return NextResponse.json({
        success: false,
        message: "gigs not found ",
        status: 200,
      });
    }
    return NextResponse.json({
      success: true,
      status: 200,
      message: "gigs found successfully",
      gigs,
    });
  } catch (error) {
    console.error("error found", error.message);
    return NextResponse.json({
      success: false,
      message: " something went wrong ",
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();

    const result = await Gigs.deleteMany({}); // Deletes all documents

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} gigs deleted successfully`,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete gigs",
      error: error.message,
      status: 500,
    });
  }
}
