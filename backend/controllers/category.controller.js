import Category from "../models/category.model.js";
import fs from "fs";
import path from "path";

// 1. Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: "Name and Image are required",
      });
    }

    // Check if category name already exists to provide a friendly message
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      // Delete the uploaded image since we are rejecting the request
      if (image) {
        fs.unlinkSync(path.join("uploads", image));
      }
      return res.status(400).json({
        success: false,
        message: `Category "${name}" already exists.`,
      });
    }

    const category = new Category({ name: name.trim(), image });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    // Handle MongoDB Duplicate Key Error (E11000)
    if (error.code === 11000) {
      if (req.file) fs.unlinkSync(path.join("uploads", req.file.filename));
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    console.error("Create Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// 2. Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// 3. Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (name) category.name = name.trim();

    if (req.file) {
      if (category.image) {
        const oldImagePath = path.join("uploads", category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = req.file.filename;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      if (req.file) fs.unlinkSync(path.join("uploads", req.file.filename));
      return res.status(400).json({ success: false, message: "Name already in use" });
    }
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// 4. Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.image) {
      const imagePath = path.join("uploads", category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};