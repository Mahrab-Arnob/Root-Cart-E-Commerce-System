import express from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controller.js";
const categoryRouter = express.Router();
categoryRouter.post("/add", isAdmin, upload.single("image"), createCategory);
categoryRouter.get("/all", getCategories);
categoryRouter.delete("/delete/:id", isAdmin, deleteCategory);
export default categoryRouter;