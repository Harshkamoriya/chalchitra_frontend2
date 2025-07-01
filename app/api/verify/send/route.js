// app/api/verify/send/route.js
import { NextResponse } from "next/server"
import VerificationCode from "@/models/VerificationCode"
import { connectToDB } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/sendEmail"
import { sendVerificationSMS } from "@/lib/sendSMS"

import { sendOtpEmail } from "@/lib/sendotpEmail"
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req) {
  await connectToDB()
  const { identifier, type } = await req.json()

  if (!identifier || !["email", "phone"].includes(type)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }



  const code = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await VerificationCode.findOneAndUpdate(
    { identifier, type },
    { code, expiresAt },
    { upsert: true }
  )

  if (type === "email") {
      try {
        console.log(identifier,"identifier")
    await sendOtpEmail(identifier, code);
    return NextResponse.json({success:true , status:200 , message :"otp send successfully"})
  } catch (error) {
    console.error("error coming in sending the otp on email" , error.message)
    return NextResponse.json({success:false , status:500 , message:"something went wrong"})

  }
}


if (type === "phone") {
  
  await sendVerificationSMS(identifier, code)
}
  // 🚨 Simulate sending (replace this with email/SMS logic)
  console.log(`Sending ${type} verification code to ${identifier}: ${code}`)

  return NextResponse.json({ message: "Verification code sent" })
}
