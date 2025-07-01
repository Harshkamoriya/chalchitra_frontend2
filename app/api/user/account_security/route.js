// app/api/user/account_security/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

export async function PATCH(req) {
  console.log("[PATCH] /api/user/account_security → Authenticating user...");
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
    const { phoneNumber, phoneVerified, emailVerified } = body;
    console.log("Received body:", body);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          phoneNumber,
          phoneVerified: !!phoneVerified,
          emailVerified: !!emailVerified,
          isSeller: true
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User verification not updated" });
    }

    console.log("Updated user verification:", updatedUser);

    return NextResponse.json({ success: true, message: "User verification updated successfully", user: updatedUser });
  } catch (error) {
    console.error("[PATCH] Verification update failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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




// import { connectToDB } from "@/lib/db";
// import authOptions from "@/lib/authOptions";
// import { NextResponse } from "next/server";
// import User from "@/models/user";
// import { authenticateUser } from "@/middlewares/auth";

// export async function POST(req){
   
//    const {user} = authenticateUser(req);
//     console.log(user , "user from authenticate user")
//     if(!user){
//       return NextResponse.json({success:false , status :404})
//     }

//   await connectToDB();
    
//     try {
      
//         const {phoneNumber , phoneVerified , emailVerified} = req.body();
//         const id = user._id;

//         // const user = await User.findOne({email : session.user.email})
//         // if(!user){
//         //     return NextResponse.json({
//         //         message:"user not found",
//         //         status:404,
//         //         success:false
//         //     })
//         // }

//         const updatedUser = await User.findOneAndUpdate({
//            id
//         },
//         {
//             $set:{
//                 phoneNumber:phoneNumber,
//                 phoneVerified:!!phoneVerified,
//                 emailVerified:!!emailVerified,
//                 isSeller:true
//             }

//         },
//         {new:true}
//     );

//    if (!updatedUser) {
//     return NextResponse.json({success:false , message:"user verification not updated"})

//     }

//     return NextResponse.json({success:true , message:"user verification updated successsfully", status:200})

//     } catch (error) {
//         console.error("Error updating user verification:", error);
//         return NextResponse.json({success:false , message:error.message , status :500})


//     }
// }