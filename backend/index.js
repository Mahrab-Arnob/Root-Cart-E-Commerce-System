import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/connectDB.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// ========================
// MIDDLEWARE
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));
app.use(cookieParser());

// STATIC FILE SERVING
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Debug log for requests (excluding socket polling)
app.use((req, res, next) => {
  if (!req.url.includes("socket.io")) {
    console.log(`📨 ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ========================
// DATABASE & MODELS
// ========================
let dbConnected = false;

const startServer = async () => {
  try {
    // 1. Connect to DB
    console.log("\n🔌 Connecting to MongoDB...");
    await connectDB();
    dbConnected = true;

    // 2. Load Routes
    console.log("🔄 Loading routes...");
    
    // Using dynamic imports to ensure files exist
    const authRoutes = (await import("./routes/auth.routes.js")).default;
    const adminRoutes = (await import("./routes/admin.routes.js")).default;
    const categoryRoutes = (await import("./routes/category.routes.js")).default;
    const productRoutes = (await import("./routes/product.routes.js")).default;
    const addressRoutes = (await import("./routes/address.routes.js")).default;
    const orderRoutes = (await import("./routes/order.routes.js")).default;
    const dashboardRoutes = (await import("./routes/dashboardRoutes.js")).default;

    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/product", productRoutes);
    app.use("/api/address", addressRoutes);
    app.use("/api/order", orderRoutes);
    app.use("/api/dashboard", dashboardRoutes);

    // 3. Health Check
    app.get("/api/health", (req, res) => {
      res.json({
        status: "OK",
        message: "Server is running",
        database: dbConnected ? "Connected" : "Disconnected"
      });
    });

    // 4. ✅ FIX: 404 Handler (Removed the "*" path)
    // app.use without a path catches everything that wasn't handled above
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });

    // 5. Global Error Handler
    app.use((err, req, res, next) => {
      console.error("❌ Server Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
      });
    });

    // 6. Start Listening
    httpServer.listen(PORT, () => {
      console.log(`\n✅ Server running: http://localhost:${PORT}`);
      console.log(`📂 Serving uploads from: ${uploadsDir}`);
    });

  } catch (error) {
    console.error("\n❌ Server failed to start:");
    console.error(error);
    process.exit(1);
  }
};

// ========================
// SOCKET.IO
// ========================
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});

io.on("connection", (socket) => {
  socket.on("adminJoin", () => {
    socket.join("admin-dashboard");
  });
});

app.set("io", io);

startServer();