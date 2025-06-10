import mongoose from 'mongoose';
import slugify from 'slugify';

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: [
      'Editing & Post Production',
      'Social & Marketing',
      'Presenter Videos',
      'Explainer Videos',
      'Animation',
      'Product Videos',
      'Motion Graphics',
      'Filmed Video Production',
      'Miscellaneous',
    ],
    required: true,
    index: true,
  },
  tags: [{ type: String }],
  packages: [
    {
      name: String,
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: Number,
      features: [String],
    },
  ],
  media: {
    coverImage: { type: String, required: true },
    gallery: {
      type: [String],
      validate: [val => val.length <= 3, 'Gallery exceeds limit of 3'],
    },
    video: { type: String },
    pdfs: [String],
  },
  requirements: [
    {
      question: String,
      type: { type: String, enum: ['text', 'file', 'multiple-choice'], default: 'text' },
      options: [String],
      required: { type: Boolean, default: true },
    },
  ],
  faq: [
    {
      question: String,
      answer: String,
    },
  ],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'paused', 'draft'], default: 'active' },
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

gigSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

gigSchema.index({ title: 'text', tags: 'text', description: 'text' });

const Gigs = mongoose.models.Gigs || mongoose.model('Gigs', gigSchema);
export default Gigs;