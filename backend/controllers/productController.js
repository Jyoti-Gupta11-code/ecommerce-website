import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Safely extract images
    const image1 = req.files?.image1?.[0]?.path || null;
    const image2 = req.files?.image2?.[0]?.path || null;
    const image3 = req.files?.image3?.[0]?.path || null;
    const image4 = req.files?.image4?.[0]?.path || null;

    const images = [image1, image2, image3, image4].filter(Boolean);

    const productData = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      bestseller: bestseller === "true",
      image: images,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product Added Successfully",
      data: product
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// list prod
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove Product
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Product Removed Successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Single Product
export const singleProduct = async (req, res) => {
  try {
    const {productId} = req.body 
    const product = await productModel.findById(req.body.id);

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};