// models/withdrawal.js
import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    transactionId: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

const Withdrawal =
  mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
