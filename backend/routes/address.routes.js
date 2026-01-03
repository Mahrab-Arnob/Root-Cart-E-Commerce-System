import express from "express";
import { isAuthDev } from "../middlewares/auth.js"; // ✅ Fixed Import Path
import { 
  addAddress, 
  getUserAddresses, 
  deleteAddress 
} from "../controllers/address.controller.js";

const router = express.Router();

// Apply middleware to all routes in this file
router.use(isAuthDev);

// Routes
router.post("/add", addAddress);
router.get("/all", getUserAddresses);
// Added delete route if you need it
router.delete("/delete/:id", deleteAddress);

export default router;