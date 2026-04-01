import mongoose from "mongoose";

// Step 1: Create Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true }
});

// Step 2: Create Model
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

// Step 3: Export Model
export default productModel;