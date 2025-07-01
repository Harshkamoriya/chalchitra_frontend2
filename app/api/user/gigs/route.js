import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";
import { NextResponse } from "next/server";

export async function GET(req) {
 const authResult = await authenticateUser(req);
  if (authResult instanceof Response) return authResult;

  const { user } = authResult;
    if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized", status: 401 });
  }

  await connectToDB();

  const { searchParams } = new URL(req.url);
  console.log("searchParams:", searchParams.toString());
  console.log("user:", user._id);
  const status = searchParams.get("status") || "active";
    console.log("Gig status:", status);
  const page = parseInt(searchParams.get("page") || "1", 10);
    console.log("Page number:", page);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
    console.log("Limit per page:", limit);

  const skip = (page - 1) * limit;

  try {
    const query = { seller: user._id, status };
    console.log(query, "query for fetching gigs");

    // Fetch gigs and total count
    const [gigs, total] = await Promise.all([
      Gigs.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Gigs.countDocuments(query)
    ]);
console.log(gigs.length, "gigs fetched for user:", user._id);
    // if (gigs.length === 0) {
    //   return NextResponse.json({ success: false, message: "No gigs found", status: 404 });
    // }
    console.log("Fetched gigs:", gigs.length, "for user:", user._id , gigs);

    return NextResponse.json({
      success: true,
      gigs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching gigs:", error.message);
    return NextResponse.json({ success: false, message: "Server error", status: 500 });
  }
}