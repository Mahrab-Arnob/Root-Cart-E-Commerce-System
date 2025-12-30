import express from "express";
import { getDashboardStats } from "../utils/dashboardStats.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Dashboard stats route (admin only)
router.get("/stats", isAuthenticated, authorizeRoles("admin"), async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
});

export default router;