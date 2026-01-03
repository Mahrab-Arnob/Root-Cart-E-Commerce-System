import express from "express";
import multer from "multer";
import path from "path";
import { 
  createCategory, 
  getCategories, 
  deleteCategory, 
  updateCategory 
} from "../controllers/category.controller.js";

const router = express.Router();

// --- Multer Configuration for Image Uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    // Clean filename: unique suffix + original extension
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage: storage });

// --- Routes ---

// POST: Add Category (with image)
router.post("/add", upload.single("image"), createCategory);

// GET: Get All
router.get("/all", getCategories);

// PUT: Update Category (with optional image)
router.put("/update/:id", upload.single("image"), updateCategory);

// DELETE: Delete Category
router.delete("/delete/:id", deleteCategory);

export default router;