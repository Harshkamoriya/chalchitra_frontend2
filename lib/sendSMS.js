// lib/sendSMS.js
import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendVerificationSMS(to, code) {
  const message = await client.messages.create({
    body: `Your verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to, // e.g., +919xxxxxxxxx
  })

  return message
}
