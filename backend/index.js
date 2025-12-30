import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

// ========================
// DATABASE CONNECTION
// ========================
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/Root&Cart"
    );
    console.log("✅ MongoDB Connected");
    
    // Create mock data if database is empty
    await createMockData();
  } catch (error) {
    console.log("⚠️ MongoDB Connection Error:", error.message);
    console.log("ℹ️ Using mock data only...");
  }
};

const createMockData = async () => {
  try {
    // Create simple schemas
    const Order = mongoose.model("Order") || mongoose.model("Order", 
      new mongoose.Schema({
        user: String,
        items: Array,
        address: String,
        totalAmount: Number,
        status: { type: String, default: "Pending" },
        paymentMethod: { type: String, default: "cod" },
      }, { timestamps: true })
    );

    const Product = mongoose.model("Product") || mongoose.model("Product",
      new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        offerPrice: Number,
        category: String,
        image: String,
        stock: Number,
      }, { timestamps: true })
    );

    const Category = mongoose.model("Category") || mongoose.model("Category",
      new mongoose.Schema({
        name: String,
        image: String,
        slug: String,
      }, { timestamps: true })
    );

    const User = mongoose.model("User") || mongoose.model("User",
      new mongoose.Schema({
        name: String,
        email: String,
        role: { type: String, default: "user" },
      }, { timestamps: true })
    );

    // Check if we need to create mock data
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("📦 Creating mock data...");
      
      // Create categories
      await Category.create([
        { name: "Fruits", image: "/uploads/fruits.jpg", slug: "fruits" },
        { name: "Vegetables", image: "/uploads/vegetables.jpg", slug: "vegetables" },
        { name: "Dairy", image: "/uploads/dairy.jpg", slug: "dairy" },
      ]);

      // Create products
      await Product.create([
        {
          name: "Fresh Apples",
          description: "Sweet red apples from local farms",
          price: 120,
          offerPrice: 99,
          category: "Fruits",
          image: "/uploads/apple.jpg",
          stock: 50
        },
        {
          name: "Organic Tomatoes",
          description: "Farm fresh organic tomatoes",
          price: 80,
          offerPrice: 65,
          category: "Vegetables",
          image: "/uploads/tomato.jpg",
          stock: 100
        },
        {
          name: "Farm Milk",
          description: "Fresh dairy milk 1L",
          price: 60,
          offerPrice: 55,
          category: "Dairy",
          image: "/uploads/milk.jpg",
          stock: 30
        },
      ]);

      // Create admin user
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
      });

      console.log("✅ Mock data created successfully");
    }
  } catch (error) {
    console.log("⚠️ Error creating mock data:", error.message);
  }
};

connectDB();

// ========================
// MIDDLEWARE
// ========================
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ========================
// SOCKET.IO SETUP
// ========================
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Function to get dashboard stats
const getDashboardStats = async () => {
  try {
    const Order = mongoose.model("Order");
    const Product = mongoose.model("Product");
    const User = mongoose.model("User");

    if (!Order || !Product || !User) {
      return getMockStats();
    }

    const [totalProducts, totalCustomers, totalOrders, revenueResult] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: "Delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
      ]),
    ]);

    return {
      totalProducts: totalProducts || 2847,
      totalCustomers: totalCustomers || 18432,
      totalOrders: totalOrders || 9251,
      totalRevenue: revenueResult[0]?.totalRevenue || 432890,
      todayOrders: 42,
      todayRevenue: 12500,
      pendingOrders: 18,
      processingOrders: 7,
    };
  } catch (error) {
    return getMockStats();
  }
};

const getMockStats = () => ({
  totalProducts: 2847,
  totalCustomers: 18432,
  totalOrders: 9251,
  totalRevenue: 432890,
  todayOrders: 42,
  todayRevenue: 12500,
  pendingOrders: 18,
  processingOrders: 7,
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("adminJoin", () => {
    socket.join("admin-dashboard");
    console.log("👑 Admin joined dashboard");
    
    // Send initial stats
    getDashboardStats().then(stats => {
      socket.emit("dashboardStats", stats);
    });
  });

  socket.on("getDashboardStats", async () => {
    const stats = await getDashboardStats();
    socket.emit("dashboardStats", stats);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Make socket available globally
app.set("io", io);
app.set("getDashboardStats", getDashboardStats);

// ========================
// API ROUTES
// ========================

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ E-commerce API Working",
    socket: "Active",
    time: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth/*",
      admin: "/api/admin/*",
      categories: "/api/category/all",
      products: "/api/product/all",
      orders: "/api/order/*",
      dashboard: "/api/dashboard/stats",
    },
  });
});

// ========================
// AUTH ROUTES
// ========================
app.get("/api/auth/is-auth", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token && token !== "null" && token !== "undefined") {
    return res.json({
      success: true,
      user: {
        _id: "user-id-123",
        name: "Test User",
        email: "user@example.com",
        role: "user"
      }
    });
  }
  res.status(401).json({ 
    success: false, 
    message: "Not authenticated",
    redirectTo: "/login"
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    const isAdmin = email === "admin@example.com";
    
    return res.json({
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-for-" + (isAdmin ? "admin" : "user"),
      user: {
        _id: isAdmin ? "admin-id-123" : "user-id-456",
        name: isAdmin ? "Admin User" : "Regular User",
        email: email,
        role: isAdmin ? "admin" : "user"
      }
    });
  }
  
  res.status(400).json({
    success: false,
    message: "Email and password required"
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    return res.json({
      success: true,
      message: "Registration successful",
      token: "mock-jwt-token-for-new-user",
      user: {
        _id: "new-user-id-" + Date.now(),
        name: name,
        email: email,
        role: "user"
      }
    });
  }
  
  res.status(400).json({
    success: false,
    message: "Name, email and password required"
  });
});

// ========================
// ADMIN ROUTES
// ========================
app.get("/api/admin/is-admin", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (token && token.includes("admin")) {
    return res.json({
      success: true,
      user: {
        _id: "admin-id-123",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
      }
    });
  }
  
  res.status(403).json({ 
    success: false, 
    message: "Not an admin",
    redirectTo: "/admin/login"
  });
});

// ========================
// CATEGORY ROUTES
// ========================
app.get("/api/category/all", async (req, res) => {
  try {
    const Category = mongoose.model("Category");
    let categories;
    
    if (Category) {
      categories = await Category.find();
    }
    
    if (!categories || categories.length === 0) {
      categories = [
        { _id: "1", name: "Fruits", image: "/uploads/fruits.jpg", slug: "fruits" },
        { _id: "2", name: "Vegetables", image: "/uploads/vegetables.jpg", slug: "vegetables" },
        { _id: "3", name: "Dairy", image: "/uploads/dairy.jpg", slug: "dairy" },
      ];
    }
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.json({
      success: true,
      categories: [
        { _id: "1", name: "Fruits", image: "/uploads/fruits.jpg", slug: "fruits" },
        { _id: "2", name: "Vegetables", image: "/uploads/vegetables.jpg", slug: "vegetables" },
        { _id: "3", name: "Dairy", image: "/uploads/dairy.jpg", slug: "dairy" },
      ]
    });
  }
});

// ========================
// PRODUCT ROUTES
// ========================
app.get("/api/product/all", async (req, res) => {
  try {
    const Product = mongoose.model("Product");
    let products;
    
    if (Product) {
      products = await Product.find();
    }
    
    if (!products || products.length === 0) {
      products = [
        {
          _id: "1",
          name: "Fresh Apples",
          description: "Sweet red apples from local farms",
          price: 120,
          offerPrice: 99,
          category: "Fruits",
          image: "/uploads/apple.jpg",
          stock: 50
        },
        {
          _id: "2",
          name: "Organic Tomatoes",
          description: "Farm fresh organic tomatoes",
          price: 80,
          offerPrice: 65,
          category: "Vegetables",
          image: "/uploads/tomato.jpg",
          stock: 100
        },
        {
          _id: "3",
          name: "Farm Milk",
          description: "Fresh dairy milk 1L",
          price: 60,
          offerPrice: 55,
          category: "Dairy",
          image: "/uploads/milk.jpg",
          stock: 30
        },
      ];
    }
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.json({
      success: true,
      products: [
        {
          _id: "1",
          name: "Fresh Apples",
          description: "Sweet red apples from local farms",
          price: 120,
          offerPrice: 99,
          category: "Fruits",
          image: "/uploads/apple.jpg",
          stock: 50
        },
        {
          _id: "2",
          name: "Organic Tomatoes",
          description: "Farm fresh organic tomatoes",
          price: 80,
          offerPrice: 65,
          category: "Vegetables",
          image: "/uploads/tomato.jpg",
          stock: 100
        },
      ]
    });
  }
});

app.get("/api/product/:id", (req, res) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    product: {
      _id: id,
      name: "Sample Product",
      description: "This is a sample product description.",
      price: 99.99,
      offerPrice: 89.99,
      category: "Fruits",
      image: "/uploads/sample.jpg",
      stock: 50,
      ratings: 4.5,
      reviews: 120
    }
  });
});

// ========================
// ORDER ROUTES
// ========================
app.post("/api/order/place", (req, res) => {
  const order = {
    _id: `ORD${Date.now()}`,
    ...req.body,
    status: "Pending",
    createdAt: new Date(),
  };

  // Emit real-time update
  getDashboardStats().then(stats => {
    io.to("admin-dashboard").emit("newOrder", {
      orderId: order._id,
      customer: req.body.userName || "Customer",
      totalAmount: order.totalAmount || 0,
      itemsCount: order.items?.length || 0,
      timestamp: new Date(),
      stats: stats,
    });
    io.to("admin-dashboard").emit("dashboardStats", stats);
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

app.get("/api/order/all", (req, res) => {
  res.json({
    success: true,
    orders: [
      { 
        _id: "ORD001", 
        totalAmount: 1500, 
        status: "Delivered", 
        customer: { name: "John Doe", email: "john@example.com" },
        items: [{ name: "Apples", quantity: 2, price: 120 }],
        createdAt: new Date(Date.now() - 86400000)
      },
      { 
        _id: "ORD002", 
        totalAmount: 2300, 
        status: "Processing", 
        customer: { name: "Jane Smith", email: "jane@example.com" },
        items: [{ name: "Tomatoes", quantity: 3, price: 80 }],
        createdAt: new Date(Date.now() - 43200000)
      },
    ],
  });
});

app.get("/api/order/my-orders", (req, res) => {
  res.json({
    success: true,
    orders: [
      { _id: "ORD001", totalAmount: 1500, status: "Delivered", createdAt: new Date(Date.now() - 86400000) },
      { _id: "ORD002", totalAmount: 2300, status: "Processing", createdAt: new Date(Date.now() - 43200000) },
    ],
  });
});

// ========================
// DASHBOARD ROUTES
// ========================
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.json({
      success: true,
      data: getMockStats(),
    });
  }
});

// ========================
// START SERVER
// ========================
httpServer.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready at ws://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log("=".repeat(50) + "\n");
});

// Auto-broadcast every 30 seconds
setInterval(async () => {
  try {
    const stats = await getDashboardStats();
    io.to("admin-dashboard").emit("dashboardStats", stats);
    console.log(`📊 Stats broadcasted at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error("Broadcast error:", error);
  }
}, 30000);

export { io, getDashboardStats };