import Gigs from "@/models/Gigs";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";

// GET a single gig by ID
export async function GET(req, { params }) {
  await connectToDB();
  // const authResult  = await authenticateUser(req);
  // if (authResult instanceof Response) return authResult;    

  // const { user } = authResult;
  // if (!user) {  
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized user" },
  //     { status: 401 }
  //   );
  // }
  const { id } = params;
  console.log(id, "gig id from params");

  try {
    const gig = await Gigs.findById(id);
    if (!gig) {
      return NextResponse.json(
        { success: false, message: "Gig not found" },
        { status: 404 }
      );
    }
    console.log(gig, "gig found");

    return NextResponse.json(
      { success: true, message: "Gig found successfully", gig },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching gig:", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

// /app/api/gig/[id]/route.js (for PATCH - update specific gig)
export async function PATCH(req, { params }) {
  await connectToDB();

  try {
    const authResult = await authenticateUser(req);
    const user = authResult.user;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized user' },
        { status: 401 }
      );
    }

    const gigId = params.id;
    const body = await req.json();

    // Fix deliveryTime mapping safely
    const deliveryTimeMap = { "1-week": 7, "3-days": 3, "2-days": 2 };

    if (Array.isArray(body.packages)) {
      body.packages = body.packages.map(pkg => ({
        ...pkg,
        deliveryTime: deliveryTimeMap[pkg.deliveryTime] || Number(pkg.deliveryTime) || 0
      }));
    }

    // ✅ use $set to avoid replacing entire document
    const updatedGig = await Gigs.findByIdAndUpdate(
      gigId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedGig) {
      return NextResponse.json(
        { success: false, message: 'Gig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, gig: updatedGig }, { status: 200 });

  } catch (err) {
    console.error("Gig update error:", err);
    return NextResponse.json(
      { success: false, message: 'Failed to update gig', error: err.message },
      { status: 500 }
    );
  }
}





// DELETE a gig by ID
export async function DELETE(req, { params }) {
  await connectToDB();
  const { id } = params;
  console.log(id, "gig id from params for delete");

  try {
    const gig = await Gigs.findByIdAndDelete(id);
    if (!gig) {
      return NextResponse.json(
        { success: false, message: "Gig not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Gig deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gig:", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

// // UPDATE a gig by ID
// export async function PUT(req, { params }) {
//   await connectToDB();
//   const { id } = params;
//   const data = await req.json();

//   console.log(data, "data from request for update");
//   console.log(id, "gig id from params for update");

//   // Sanitize data: only allow valid fields
//   const allowedFields = ["title", "description", "price", "image", "gallery", "category"];
//   const sanitizedData = allowedFields.reduce((acc, field) => {
//     if (data[field] !== undefined) acc[field] = data[field];
//     return acc;
//   }, {});

//   try {
//     const updatedGig = await Gigs.findByIdAndUpdate(id, sanitizedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedGig) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Gig not found and not updated",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Gig updated successfully",
//         gig: updatedGig,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating gig:", error);
//     return NextResponse.json(
//       { success: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
