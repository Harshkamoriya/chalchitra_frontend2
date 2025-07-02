import { connectToDB } from "@/lib/db"
import { authenticateUser } from "@/middlewares/auth";
import { connect } from "cookies"
import User from "@/models/user";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, )
export async function POST(req){
    await connectToDB();
    try {

        const authResult = authenticateUser(req);
        const {user} = authResult;
        if(!user){
            return NextResponse.json({success:false , message:"user not authorized", status:401}) 
        
        }
       if(!user.stripeAccountId){
        const account  = await stripe.accounts.create({type:'express'});
        user.stripeAccountId = account.id;
        await user.save();
        }

       const link = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/success`,
    type: 'account_onboarding',
  });

  return NextResponse.json({
    success:true , message:"Stripe account link created successfully",
    status:201,
    url:link.url
  })
        
    } catch (error) {
        console.error("not able to create an stripe account of the seller", error.message)
        return NextResponse.json({ success:false, status:500 , error})
    }
}