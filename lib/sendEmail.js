import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(toEmail, code) {
  console.log("Sending to:", toEmail)
  console.log("Code:", code)
  console.log("From:", process.env.FROM)

  try {
    const res = await resend.emails.send({
      from: process.env.FROM,
      to: [toEmail],
      subject: "Your Verification Code",
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    })

    console.log("Resend response:", res)
    return res
  } catch (err) {
    console.error("Resend send error:", err)
    throw err
  }
}
