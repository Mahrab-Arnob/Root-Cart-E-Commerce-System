// backend/routes/auth.routes.js
import express from "express";
import { isAuth } from "../middleware/isAuth.js"; // This now exists

const router = express.Router();

// Auth routes
router.post("/register", (req, res) => {
  res.json({ 
    success: true, 
    message: "Registration endpoint",
    user: {
      _id: "new-user-id",
      name: req.body.name || "New User",
      email: req.body.email,
      role: "user"
    }
  });
});

router.post("/login", (req, res) => {
  res.json({ 
    success: true, 
    message: "Login successful", 
    token: "test-jwt-token",
    user: {
      _id: "test-id",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    }
  });
});

router.get("/me", isAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;