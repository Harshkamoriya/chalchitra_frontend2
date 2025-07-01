import mongoose from 'mongoose';

const gigAnalyticsSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gigs', required: true, unique: true },
  impressions: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  cancellations: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  // optional: conversionRate (can be virtual)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Optional: add virtual for conversion rate
gigAnalyticsSchema.virtual('conversionRate').get(function () {
  return this.impressions > 0 ? (this.orders / this.impressions) * 100 : 0;
});

gigAnalyticsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const GigAnalytics = mongoose.models.GigAnalytics || mongoose.model('GigAnalytics', gigAnalyticsSchema);
export default GigAnalytics;
