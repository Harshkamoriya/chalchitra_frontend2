import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gigs",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  packageType: {
    type: String,
    enum: ["basic", "standard", "premium"],
    required: true,
  },

  price: { type: Number, required: true },

  requirements: [
    {
      question: String,
      answer: String,
    },
  ],

  status: {
    type: String,
    enum: ["pending", "in_progress", "delivered", "completed", "cancelled", "revision"],
    default: "pending",
  },

  isRated: {
    type: Boolean,
    default: false,
  },

  delivery: {
    message: { type: String },
    files: [{ type: String }], // Cloudinary/file URLs
    deliveredAt: { type: Date },
  },

  createdAt: { type: Date, default: Date.now },

  dueDate: { type: Date, required: true }, // Usually deliveryTime days from createdAt
});

const Orders = mongoose.models.Orders || mongoose.model("Orders", orderSchema);
export default Orders;
