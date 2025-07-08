import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firstname:{type:String ,required:false},
    lastname:{type:String ,required:false},
    displayName: { type: String }, // Optional: Public display name

    email: { type: String, required: true, unique: true },
    image: { type: String },

    password: {
      type: String,
      required: function () {
        // Required only if the user is not a Google user
        return !this.googleId;
      },
    },

    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null values to skip uniqueness when not present
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // allows null values to skip uniqueness when not present
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    isSeller: { type: Boolean, default: false },
    isbuyer: { type: Boolean, default: true },
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
    phoneNumber: {
      type: String,
      required: function () {
        return !this.googleId; // only required if not a Google user
      },
      unique: true,
      match: [
        /^\+[1-9]\d{7,14}$/,
        "Phone number must be in valid international format (E.164)",
      ],
    },


    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false }, // Email verified

    completedOrders: { type: Number, default: 0 },

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    stripeAccountId: { type: String },             // seller ka Stripe connected account id
    isStripeOnboarded: { type: Boolean, default: false }, // onboarding complete?


    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Full-text index for better search
UserSchema.index({ name: "text", skills: "text", description: "text" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
