// Notification model
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['order', 'message', 'system', 'payment', 'rating']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);