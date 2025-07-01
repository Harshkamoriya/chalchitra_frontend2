import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Chalchitra" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify your email - Chalchitra',
    html: `
      <h2>Hello ${user.name},</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};
