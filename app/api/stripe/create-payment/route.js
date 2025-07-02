import { connectToDB } from "@/lib/db";
import { authenticateUser } from "@/middlewares/auth";
import Orders from "@/models/orders";
import { NextResponse } from "next/server";


export async function POST(req){
    await connectToDB();
    const {user} = await authenticateUser(req);
    if(!user){
        return NextResponse.json({
            success:false , message:"unauthorized",status:401
        })
    }

    try {
        const {orderId} = await req.json();
        const order = await Orders.findById(orderId);
        if(!order){
            return NextResponse.json({
                success:false , status :404, message:"order not found"
            })
        }

        const seller = await user.findById(order.seller)
        if(!seller?.stripeAccointId)return NextResponse.json(
            {success:false , message:"seller not inboarded  "},{status:400}
        )

        const fee = Math.round(order.price * 0.2 *100)
        const transferAmount = order.price *100 -fee;

        const paymentIntent  =await stipe.paymentIntents.create({
            amount :order.price *100,
            currency:'usd',
            application_fee_amount:fee,
            transfer_data:{ destination:seller.stripeAccountId},
            metaData:{orderId: order._id.toString()}
        });

        order.paymentIntentId = paymentIntent.id;
        order.appliationFeeAmount = fee;
        order.transferAmount = transferAmount;
        await order.save();

        return NextResponse.json({success:true , message:"transaction successfull" , status :201 ,
            clientSecret:paymentIntent.client_secret
        })


    } catch (error) {
        console.error("error doing payment" , error.message)
        return NextResponse.json({success:false , status :500 ,error})
    }
}