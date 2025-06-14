import mongoose from "mongoose";

const savedGigSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gigs",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicates: one user can't save same gig twice
savedGigSchema.index({ user: 1, gig: 1 }, { unique: true });

const SavedGig =
  mongoose.models.SavedGig || mongoose.model("SavedGig", savedGigSchema);
export default SavedGig;
