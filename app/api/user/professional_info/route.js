// app/api/user/professional/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

export async function PATCH(req) {
  console.log("[PATCH] /api/user/professional → Authenticating user...");
  const authResult = await authenticateUser(req);

  if (authResult instanceof Response) {
    console.log("Authentication failed");
    return authResult;
  }

  const { user } = authResult;
  if (!user) {
    console.log("User undefined after authentication");
    return NextResponse.json({ success: false, status: 404 });
  }

  await connectToDB();

  try {
    const body = await req.json();
    console.log("Received body:", body);

    const {
      occupation,
      skills,
      education,
      certifications,
      website,
    } = body;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          occupation,
          skills,
          education,
          certifications,
          website,
        }
      },
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[PATCH] Professional data update failed:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


export async function GET(req) {
  const authResult = await authenticateUser(req);
  if (authResult instanceof Response) return authResult;

  const { user } = authResult;
  await connectToDB();

  try {
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: existingUser });
  } catch (error) {
    console.error("[GET] personal info error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}










// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import authOptions from "@/lib/authOptions";
// import User from "@/models/user";
// import { connectToDB } from "@/lib/db";
// import { authenticateUser } from "@/middlewares/auth";

// export async function POST(req) {

//    const {user} = authenticateUser(req);
//     console.log(user , "user from authenticate user")
//     if(!user){
//       return NextResponse.json({success:false , status :404})
//     }

//   await connectToDB();

  

//   try {
//     console.log("in the backend route of professional data")
//     const body = await req.json();
//     console.log(body , "body fetched in the backend")
//     // console.log(body);
//     const id = user._id;
//     console.log(id , "id");

    
//     const {
//     occupation,
//     skills,
//     education,
//     certifications,
//     website,

//     } = body;

//     // const name = firstName + " "+ lastName;

//     const updatedUser = await User.findOneAndUpdate(
//       { id},
//       {
//         $set: {
//                 occupation,
//     skills,
//     education,
//     certifications,
//     website,
         
//         },
//       },
//       { new: true, upsert: true }
//     );

//     return NextResponse.json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error(error , "error in catch");
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

