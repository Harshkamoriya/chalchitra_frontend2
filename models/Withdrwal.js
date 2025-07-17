import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payoutMethodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PayoutMethod',
    required: true,
  },
  amount: {
    type: Number,
    required: true, // in smallest currency unit (cents)
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  stripeTransferId: String, // Stripe transfer ID
  processingFee: Number, // Platform processing fee
  netAmount: Number, // Amount after fees
  
  // Failure details
  failureReason: String,
  failureCode: String,
  
  // Processing dates
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
  completedAt: Date,
  
  // Related orders (for tracking which earnings are being withdrawn)
  orderIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders'
  }],
  
  notes: String,
  
}, {
  timestamps: true
});

const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;