import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Gigs from "@/models/Gigs";

export async function GET(req) {
  console.log("[Backend] GET /api/user/gigs - Starting request");
  
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

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "live";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search");
  const skip = (page - 1) * limit;

  console.log("[Backend] Query params:", { status, page, limit, search });

  try {
    // Build query
    const query = { 
      seller: user._id,
      status: status 
    };

    // Add search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { category: searchRegex }
      ];
    }

    console.log("[Backend] Final MongoDB query:", JSON.stringify(query, null, 2));

    // Execute queries
    const [gigs, total] = await Promise.all([
      Gigs.find(query)
        .sort({ lastModified: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Gigs.countDocuments(query)
    ]);

    console.log(`[Backend] Found ${gigs.length} gigs out of ${total} total`);

    return NextResponse.json({
      success: true,
      gigs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("[Backend] Error fetching gigs:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch gigs", 
      error: error.message 
    }, { status: 500 });
  }
}



export async function POST(req) {
  await connectToDB()

  const authResult = await authenticateUser(req)
  if (authResult instanceof Response) return authResult

  const {user} = authResult
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized user", status: 401 })
  }

  try {
    const body = await req.json()
    console.log(body, " body of gig");

    const newGig = new Gigs({
      ...body,
      seller: user._id,
      status: body.status || "draft",
    })

    const savedGig = await newGig.save()

    return NextResponse.json({ success: true, message: "Gig created", status: 201, gig: savedGig })
  } catch (err) {
    console.error("Gig creation error:", err)
    return NextResponse.json({ success: false, message: "Failed to create gig", status: 500 })
  }
}