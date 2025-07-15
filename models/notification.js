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
    enum: ['order', 'message', 'system', 'payment', 'rating'] // or even 'custom'
  },

  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  actionUrl: {
    type: String,
    default: null // where user should go on click
  },
  isRead: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },

}, { timestamps: true }); // adds createdAt & updatedAt

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
