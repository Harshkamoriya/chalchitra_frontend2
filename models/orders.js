// models/Order.js
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

selectedPackage: {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  revisions: { type: Number, required: true },
  features: [String],
  rushDelivery: { type: Boolean, default: false },
  rushTime: String,
  rushPrice: Number,
  inputLength: String,
  outputLength: String,
}
,
ispaid:{type:Boolean, default:false},
  price: { type: Number, required: true },
  addons: [{ id: String, price: Number , deliveryTime: String }], // e.g., [{ id: "addon1", price: 10, deliveryTime: 2 }]
    dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now },

  requirements: [
    {
      question: String,
      answer: String,
    },
  ],

  note: { type: String }, // short buyer note

  status: {
    type: String,
    enum: [
      "pending",
      "awaiting_requirements",
      "in_progress",
      "delivered",
      "completed",
      "cancelled",
      "revision",
      "overdue",
      "urgent"
    ],
    default: "pending",
  },

  isStarred: { type: Boolean, default: false },

  delivery: {
    message: { type: String },
    files: [{ type: String }],
    deliveredAt: { type: Date },
  },



  // Extra fields for dashboard, analytics, filtering
  category: { type: String },  // e.g., "Graphic Design"
  serviceTitle: { type: String }, // "Logo Design & Brand Identity"
  isRated: { type: Boolean, default: false },

  // Extra fields to add (suggested)
paymentIntentId: { type: String },       // Stripe payment intent id
paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },

payoutStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
applicationFeeAmount: { type: Number },  // platform commission (in smallest currency unit, e.g. paise)
transferAmount: { type: Number },        // amount going to seller (after fee)
currency: { type: String, default: 'usd' },

}, {
  timestamps: true // adds createdAt & updatedAt
});

const Orders = mongoose.models.Orders || mongoose.model("Orders", orderSchema);
export default Orders;
