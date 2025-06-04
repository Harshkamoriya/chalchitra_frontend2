// models/user.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
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
    default: "credentials",
  },
  role: {
    type: String,
    default: "user",
  },
});

const User =  mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
