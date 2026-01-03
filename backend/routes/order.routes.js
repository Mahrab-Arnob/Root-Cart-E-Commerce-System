import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/order.controller.js";
import { isAuthDev, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/place", isAuthDev, placeOrder);
router.get("/my-orders", isAuthDev, getUserOrders);
router.get("/all", isAuthDev, authorizeRoles("admin"), getAllOrders);
router.get("/stats", isAuthDev, authorizeRoles("admin"), getOrderStats);
router.put(
  "/:orderId/status",
  isAuthDev,
  authorizeRoles("admin"),
  updateOrderStatus
);

export default router;