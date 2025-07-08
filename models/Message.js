// Message model
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  fileName: {
    type: String,
    required: false
  },
  fileUrl: {
    type: String,
    required: false
  },
  fileSize: {
    type: Number,
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);