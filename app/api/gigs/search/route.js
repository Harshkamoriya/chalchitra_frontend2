import { connectToDB } from "@/lib/db";
import Gigs from "@/models/Gigs";
import { NextResponse } from "next/server";

export async function GET(){
    await connectToDB();
    try {
        const {searchParams} = new URL(req.url);
        const query  = searchParams.get("query")||"";

        const gigs = await Gigs.find({$text:{$search:query}});
        if(!gigs){
            return NextResponse.json({
                success:false,
                status:404,
                message:"gigs not found"
            })
        }
        return NextResponse.json({success:true , message:"gig found successfully", status :200 , gigs})

    } catch (error) {
        
    }
}