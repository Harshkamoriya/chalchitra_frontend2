import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // your gmail
      pass: process.env.EMAIL_PASS,     // app password (not your real Gmail password!)
    },
  });

  const mailOptions = {
    from: `"Chalchitra" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Chalchitra",
    html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
