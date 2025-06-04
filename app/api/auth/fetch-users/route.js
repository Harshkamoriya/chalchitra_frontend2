import User from "@/models/user";
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req){
    try {

        await connectToDB();
        
        const users = await User.find({});
        if(!users){
            return NextResponse.json({success:false , message:"users not found ", status:404})

        }
        return NextResponse.json({success:true , message :"users data fetched successfully", status:200 , users});


    } catch (error) {
        console.error("error fetching the users data" , error.message);
        return NextResponse.json({success:false ,message:error.message  , status:500});
        
    }
}