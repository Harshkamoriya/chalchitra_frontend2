import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req){
    await connectToDB();
    try {
        const session  = await getServerSession(authOptions);
        if(!session || session?.user?.email){return NextResponse.json({
            message:"unAuthorized",
            status:401,

        })}
        const {phoneNumber , phoneVerified , emailVerified} = req.body();


        // const user = await User.findOne({email : session.user.email})
        // if(!user){
        //     return NextResponse.json({
        //         message:"user not found",
        //         status:404,
        //         success:false
        //     })
        // }

        const updatedUser = await User.findOneAndUpdate({
            email:session.user.email
        },
        {
            $set:{
                phoneNumber:phoneNumber,
                phoneVerified:!!phoneVerified,
                emailVerified:!!emailVerified,
            }
        },
        {new:true}
    );

   if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Verification status updated", user: updatedUser });

    } catch (error) {
        console.error("Error updating user verification:", error);
    return res.status(500).json({ message: "Server error" });
  


    }
}