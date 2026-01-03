import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthDev = async (req, res, next) => {
  try {
    // 1. Get token from Cookies OR Authorization Header
    const token = req.cookies.token || 
                  (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: "Login required (No Token)" });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // 3. Handle Temporary/Dev Users (from your auth controller logic)
    if (decoded.userId && decoded.userId.toString().startsWith("temp-")) {
       req.user = { _id: decoded.userId, role: decoded.role || 'user' };
       req.userId = decoded.userId;
       return next();
    }

    // 4. Find Real User in DB
    const user = await User.findById(decoded.userId || decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 5. Attach to Request
    req.user = user;
    req.userId = user._id;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

// Admin helper specifically for product routes
export const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Admin resources only" });
  }
};