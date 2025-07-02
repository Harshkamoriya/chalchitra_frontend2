// models/Transaction.js
import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
  type: { type: String, enum: ['payment', 'payout', 'refund'] },   // classify what kind of transaction
  stripeTransactionId: { type: String },  // Stripe paymentIntent id, transfer id, refund id
  amount: Number,                         // in smallest currency unit (e.g., paise)
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', txSchema);
export default Transaction;
