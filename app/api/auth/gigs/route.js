import { NextResponse } from "next/server";
import User from "@/models/user";
import Gigs from "@/models/Gigs";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/db";


export async function POST(req){

  const session = await getServerSession();
  if(!session?.user?.email)
    return NextResponse.json({message:"unauthorized",status:401, success:false});
  console.log("session in route of posting gigs", session);
    try {
        await connectToDB();
        const data = await req.json();
        console.log(data , "data in route of posting gigs");
        const {title , description, price ,category , thumbnail , userEmail}= data;
        const user = await User.findOne({email: userEmail});
        if(!user){
            console.log("user not found")
            return NextResponse.json({message:"user not found", status:404 ,success:false} )
        }

        const gig = await Gigs.create({
            title,
            description,
            category,
            price,
            thumbnail,
            user:user._id,

        })

        await gig.save();
        console.log(gig , "gig created successfully");
        return NextResponse.json({message:"Gig created successfully",success:true, status:201, gig});

    } catch (error) {

        console.error("Error creating gig:", error);
        return NextResponse.json({message:"Something went wrong", status:500, success:false});
        
    }
}

export async function GET(){
    try {
        await connectToDB();
        const gigs = await Gigs.findAll({});
        if(!gigs){
            return NextResponse.json({success:false , message: "gigs not found " , status:200});

        }
        return NextResponse.json({success:true , status:200 ,message:"gigs found successfully"});
    } catch (error) {
        console.error("error found" , error.message);
        return NextResponse.json({success:false , message:" something went wrong " , status :500});
        
    }
}