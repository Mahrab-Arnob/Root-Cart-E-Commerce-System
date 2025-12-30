import Category from "../models/category.model.js";
import fs from "fs";
import path from "path";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file.filename;
    console.log(name, "image", image);

    const category = new Category({ name, image });
    await category.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};
// Get All Categories

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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
// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    // Delete image file if exists
    if (category.image) {
      const imagePath = path.join("uploads", category.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err.message);
        }
      });
    }
    // Now delete category from DB
    await Category.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Category and image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};