import fs from "fs";
import path from "path";
import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const imageFilenames = req.files.map((file) => file.filename);
    // Create new product
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      smallDesc: req.body.smallDesc,
      longDesc: req.body.longDesc,
      weight: req.body.weight,
      category: req.body.category,
      images: imageFilenames,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product first
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join("uploads", image);
        fs.unlink(imagePath, (err) => {
          if (err)
            console.error(`Failed to delete image ${image}:`, err.message);
        });
      });
    }
    await Product.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Product and its images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};