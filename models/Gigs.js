// import mongoose from 'mongoose';
// import slugify from 'slugify';

// const gigSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   slug: { type: String, unique: true },
//   description: { type: String, required: true },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   category: {
//     type: String,
//     enum: [
//       'Editing & Post Production',
//       'Social & Marketing',
//       'Presenter Videos',
//       'Explainer Videos',
//       'Animation',
//       'Product Videos',
//       'Motion Graphics',
//       'Filmed Video Production',
//       'Miscellaneous',
//     ],
//     required: true,
//     index: true,
//   },
//   tags: [{ type: String }],
//   packages: [
//     {
//       name: String,
//       description: String,
//       price: Number,
//       deliveryTime: Number,
//       revisions: Number,
//       features: [String],
//     },
//   ],
//   media: {
//     coverImage: { type: String, required: true },
//     gallery: {
//       type: [String],
//       validate: [val => val.length <= 3, 'Gallery exceeds limit of 3'],
//     },
//     video: { type: String },
//     pdfs: [String],
//   },
//   requirements: [
//     {
//       question: String,
//       type: { type: String, enum: ['text', 'file', 'multiple-choice'], default: 'text' },
//       options: [String],
//       required: { type: Boolean, default: true },
//     },
//   ],
//   faq: [
//     {
//       question: String,
//       answer: String,
//     },
//   ],
//   rating: {
//     average: { type: Number, default: 0 },
//     count: { type: Number, default: 0 },
//   },
//   isFeatured: { type: Boolean, default: false },
//   status: { type: String, enum: ['active', 'paused', 'draft'], default: 'active' },
//   views: { type: Number, default: 0 },
//   impressions: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now },
// });

// gigSchema.pre('save', function (next) {
//   if (!this.isModified('title')) return next();
//   this.slug = slugify(this.title, { lower: true, strict: true });
//   next();
// });

// gigSchema.index({ title: 'text', tags: 'text', description: 'text' });

// const Gigs = mongoose.models.Gigs || mongoose.model('Gigs', gigSchema);
// export default Gigs;

import mongoose from 'mongoose';
import slugify from 'slugify';

const packageSchema = new mongoose.Schema({
  name: String,
  price: Number,
  deliveryTime: Number,
  revisions: Number,
  features: [String],
  rushDelivery: { type: Boolean, default: false },
  rushTime: String,
  rushPrice: Number,
  inputLength: String,
  outputLength: String,
});

const addOnSchema = new mongoose.Schema({
  id: String,
  price: Number,
  deliveryTime: String,
});

const mediaSchema = new mongoose.Schema({
  coverImage: { type: String },
  gallery: {
    type: [String],
    validate: [val => val.length <= 3, 'Gallery exceeds limit of 3'],
  },
  video: String,
  pdfs: [String],
});

const requirementSchema = new mongoose.Schema({
  question: String,
  type: { type: String, enum: ['text', 'file', 'multiple-choice'], default: 'text' },
  options: [String],
  required: { type: Boolean, default: true },
});

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const allowedTags = [
  "intro", "outro", "logo animation", "color grading", "transitions",
  "captions", "subtitles", "sound design", "green screen", "motion graphics",
  "vfx", "slow motion", "timelapse", "3D", "2D animation",
  "voiceover sync", "storyboarding", "youtube", "instagram", "tiktok",
  "wedding", "gaming", "vlog", "product demo", "commercial", "corporate"
];

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: [
      "music-video-editing",
      "wedding-event-editing",
      "commercial-ad-editing",
      "youtube-vlog-editing",
      "gaming-editing",
      "podcast-editing",
      "short-form-reels-shorts",
      "faceless-youtube-channel-editing",
      "corporate-educational-editing",
    ],
    required: true,
    index: true,
  },
  
tags: [{
  type: String,
  enum: allowedTags
}],
  maxDuration: String,
  packages: [packageSchema],
  addOns: [addOnSchema],
  media: mediaSchema,
  portfolioDescription: String,
  portfolioWebsite: String,
  requirements: [requirementSchema],
  faq: [faqSchema],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'paused', 'draft'], default: 'draft' },
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

