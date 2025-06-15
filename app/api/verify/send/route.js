// app/api/verify/send/route.js
import { NextResponse } from "next/server"
import VerificationCode from "@/models/VerificationCode"
import { connectToDB } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/sendEmail"
import { sendVerificationSMS } from "@/lib/sendSMS"

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
    console.log("inside backend of sending email")
  await sendVerificationEmail(identifier, code)
}

if (type === "phone") {
  
  await sendVerificationSMS(identifier, code)
}
  // 🚨 Simulate sending (replace this with email/SMS logic)
  console.log(`Sending ${type} verification code to ${identifier}: ${code}`)

  return NextResponse.json({ message: "Verification code sent" })
}
