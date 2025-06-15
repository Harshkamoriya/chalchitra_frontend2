import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String }, // Optional: Public display name

  email: { type: String, required: true, unique: true },
  image: { type: String },

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

  isSeller: { type: Boolean, default: false },
  sellerLevel: {
    type: String,
    enum: ["new", "level_1", "level_2", "top_rated"],
    default: "new",
  },

  description: { type: String, maxlength: 1000 },
  country: { type: String },
  languages: [{ type: String }],
  skills: [{ type: String }],

  occupation: { type: String },

  education: [
    {
      school: String,
      degree: String,
      field: String,
      from: Date,
      to: Date,
      description: String,
    },
  ],

  certifications: [
    {
      name: String,
      issuer: String,
      date: Date,
      link: String,
    },
  ],

  portfolio: [{ type: String }],

  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    website: { type: String },
  },

  phoneVerification: {
    phoneNumber: String,
    isVerified: { type: Boolean, default: false },
  },

  isVerified: { type: Boolean, default: false }, // Email verified

  completedOrders: { type: Number, default: 0 },

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Full-text index for better search
UserSchema.index({ name: "text", skills: "text", description: "text" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
