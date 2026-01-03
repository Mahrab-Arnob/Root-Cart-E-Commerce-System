import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to ensure images is always an array
const sanitizeProduct = (product) => {
  return {
    ...product,
    images: Array.isArray(product.images) ? product.images : [],
    price: product.price || 0,
    stock: product.stock || 0
  };
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category, stock, weight } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price, and category are required" });
    }

    let imageFilenames = [];
    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map((file) => file.filename);
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : 0,
      description: description || "",
      category,
      stock: stock ? parseInt(stock) : 0,
      weight: weight || "",
      images: imageFilenames,
    });

    await product.save();

    res.status(201).json({ success: true, message: "Product added successfully", product });

  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const rawProducts = await Product.find({})
      .populate("category", "name _id")
      .sort({ createdAt: -1 })
      .lean();

    // Sanitize: ensure images is always an array
    const products = rawProducts.map(sanitizeProduct);

    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Get All Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name _id")
      .lean();

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product: sanitizeProduct(product) });
  } catch (error) {
    console.error("❌ Get Product By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.filename);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("category", "name _id");

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Delete associated images
    if (product.images && Array.isArray(product.images)) {
      const uploadsDir = path.join(__dirname, '../uploads');
      product.images.forEach((img) => {
        const filePath = path.join(uploadsDir, img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};