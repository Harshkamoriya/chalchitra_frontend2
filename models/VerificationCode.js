// models/VerificationCode.js


import mongoose from "mongoose"

const VerificationCodeSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone
  type: { type: String, enum: ["email", "phone"], required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
})

export default mongoose.models.VerificationCode ||
  mongoose.model("VerificationCode", VerificationCodeSchema)
