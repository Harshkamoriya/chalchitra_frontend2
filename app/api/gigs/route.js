import { NextResponse } from "next/server";
import User from "@/models/user";
import Gigs from "@/models/Gigs";

import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/db";
import authOptions from "@/lib/authOptions"; // ✅ Import authOptions

export async function POST(req) {
  const session = await getServerSession(authOptions); // ✅ use authOptions

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "unauthorized",
      status: 401,
      success: false,
    });
  }

  console.log("session in route of posting gigs", session);

  try {
    await connectToDB();
    const data = await req.json();

    const { title, description, price, image, gallery, category } = data;

    const user = await User.findOne({ email: session.user.email }); // ✅ Fix here too

    if (!user) {
      console.log("user not found");
      return NextResponse.json({
        message: "user not found",
        status: 404,
        success: false,
      });
    }

    const gig = await Gigs.create({
      title,
      description,
      price,
      image,
      gallery,
      category,
      user: user._id,
    });

    await gig.save();

    return NextResponse.json({
      message: "Gig created successfully",
      success: true,
      status: 201,
      gig,
    });
  } catch (error) {
    console.error("Error creating gig:", error);
    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
      success: false,
    });
  }
}


export async function GET(){
    try {
      
        await connectToDB();
        const gigs = await Gigs.find({});
        console.log(gigs , "where are the gigs")
        if(!gigs){
            return NextResponse.json({success:false , message: "gigs not found " , status:200});

        }
        return NextResponse.json({success:true , status:200 ,message:"gigs found successfully" , gigs});
    } catch (error) {
        console.error("error found" , error.message);
        return NextResponse.json({success:false , message:" something went wrong " , status :500});
        
    }
}