// app/api/verify/check/route.js
import { NextResponse } from "next/server"
import VerificationCode from "@/models/VerificationCode"
import { connectToDB } from "@/lib/db"

export async function POST(req) {
  await connectToDB()
  const { identifier, type, code } = await req.json()

  const record = await VerificationCode.findOne({ identifier, type })

  if (!record || record.code !== code || record.expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: "Invalid or expired code" }, { status: 400 })
  }

  await VerificationCode.deleteOne({ identifier, type })

  return NextResponse.json({ success: true })
}
