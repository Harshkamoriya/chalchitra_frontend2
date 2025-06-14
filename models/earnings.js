// models/earning.js
import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gigs", required: true },
    amount: { type: Number, required: true }, // Actual seller earning (after commission)
    platformFee: { type: Number, required: true }, // Platform commission fee
    status: {
      type: String,
      enum: ["pending", "available", "withdrawn"],
      default: "pending",
    },
    availableAt: { type: Date }, // Date after which funds become withdrawable
  },
  { timestamps: true }
);

const Earning = mongoose.models.Earning || mongoose.model("Earning", earningSchema);
export default Earning;
