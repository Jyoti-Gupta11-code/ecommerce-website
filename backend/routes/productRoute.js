import express from "express";
import upload from "../middleware/multer.js";
import {
  addProduct,
  removeProduct,
  singleProduct,
  listProducts
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Add Product with 4 Images
productRouter.post(
  "/add",adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  addProduct
);

// Remove Product
productRouter.post("/remove",adminAuth ,removeProduct);

// Single Product
productRouter.post("/single", singleProduct);

// List Products
productRouter.get("/list", listProducts);

export default productRouter;