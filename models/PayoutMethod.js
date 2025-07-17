import mongoose from 'mongoose';

const payoutMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['bank_account', 'paypal', 'stripe_express'],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Bank account details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    accountType: { type: String, enum: ['checking', 'savings'] },
    country: String,
  },
  
  // PayPal details
  paypalDetails: {
    email: String,
  },
  
  // Stripe Express account details
  stripeDetails: {
    accountId: String,
    isVerified: { type: Boolean, default: false },
  },
  
  // Display name for UI
  displayName: String,
  lastFourDigits: String,
  
}, {
  timestamps: true
});

const PayoutMethod = mongoose.models.PayoutMethod || mongoose.model('PayoutMethod', payoutMethodSchema);
export default PayoutMethod;