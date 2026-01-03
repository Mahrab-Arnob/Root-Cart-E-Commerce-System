import express from "express";
import { isAuthDev, isAdmin } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const productRouter = express.Router();

// Public routes
productRouter.get("/all", getAllProducts);
productRouter.get("/:id", getProductById);

// Protected routes (Admin only)
productRouter.post("/add", isAuthDev, isAdmin, upload.array("images", 10), addProduct);
productRouter.put("/update/:id", isAuthDev, isAdmin, upload.array("images", 10), updateProduct);
productRouter.delete("/delete/:id", isAuthDev, isAdmin, deleteProduct);

export default productRouter;