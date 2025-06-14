import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  image: { type: String }, // Profile picture

  password: {
    type: String,
    required: function () {
      return this.provider === "credentials";
    },
  },

  provider: {
    type: String,
    enum: ["credentials", "google", "github"],
    default: "credentials",
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isSeller: { type: Boolean, default: false }, // Determines if user can create gigs

  sellerLevel: {
    type: String,
    enum: ["new", "level_1", "level_2", "top_rated"],
    default: "new",
  },

  about: { type: String, maxlength: 1000 },

  country: { type: String },

  languages: [{ type: String }],

  skills: [{ type: String }], // Optional: Used for filtering/search

  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    website: { type: String },
  },

  portfolio: [{ type: String }], // Links to portfolio projects or videos

  isVerified: { type: Boolean, default: false },

  completedOrders: { type: Number, default: 0 },

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

// Full-text index for profile search
UserSchema.index({ name: "text", skills: "text", about: "text" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
