import mongoose from "mongoose";

// Step 1: Create Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
  },
  { minimize: false }
);

// Step 2: Create Model
const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

// Step 3: Export Model
export default userModel;