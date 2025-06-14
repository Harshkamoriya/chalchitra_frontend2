import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["order", "message", "review", "withdrawal", "custom"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    link: {
      type: String, // e.g. /orders/xyz or /messages/abc
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
