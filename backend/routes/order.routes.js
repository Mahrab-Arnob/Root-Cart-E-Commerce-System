import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/order.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/place", isAuthenticated, placeOrder);
router.get("/my-orders", isAuthenticated, getUserOrders);
router.get("/all", isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.get("/stats", isAuthenticated, authorizeRoles("admin"), getOrderStats);
router.put(
  "/:orderId/status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateOrderStatus
);

export default router;