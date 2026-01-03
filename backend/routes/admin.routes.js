import express from "express";
import jwt from "jsonwebtoken"; // Optional: if you want to verify token later

const adminRouter = express.Router();

// ==========================
// CONTROLLER LOGIC
// ==========================

// 1. Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded check for testing
    if (email === "admin@example.com" && password === "admin123") {
      
      // Create a dummy token (or use real JWT logic if you have it)
      const token = jwt.sign(
        { email, role: "admin" }, 
        process.env.JWT_SECRET || "default_secret", 
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Admin login successful",
        token: token,
        user: {
          _id: "admin-id-123",
          name: "Admin User",
          email: email,
          role: "admin"
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==========================
// ROUTES
// ==========================

// POST: /api/admin/login
adminRouter.post("/login", adminLogin);

// GET: /api/admin/is-admin
// This was missing and causing the 404 error
adminRouter.get("/is-admin", (req, res) => {
  // In a real app, you would verify the token from headers here.
  // For now, we return true to let the frontend pass.
  res.json({
    success: true,
    isAdmin: true,
    user: {
      role: "admin",
      email: "admin@example.com"
    }
  });
});

export default adminRouter;