import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = async () => {
  try {
    // Get counts in parallel for better performance
    const [totalProducts, totalCustomers, totalOrders, revenueResult] = 
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: "user" }),
        Order.countDocuments(),
        Order.aggregate([
          {
            $match: {
              status: { $in: ["Delivered", "Completed"] },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
        ]),
      ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayOrders, todayRevenue] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: today },
            status: { $in: ["Delivered", "Completed"] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    const todayRevenueTotal = todayRevenue[0]?.total || 0;

    return {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      todayOrders,
      todayRevenue: todayRevenueTotal,
      // Additional metrics you might want
      pendingOrders: await Order.countDocuments({ status: "Pending" }),
      processingOrders: await Order.countDocuments({ status: "Processing" }),
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    return {
      totalProducts: 0,
      totalCustomers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      todayOrders: 0,
      todayRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      averageOrderValue: 0,
    };
  }
};

// Function to emit stats periodically (optional, for auto-refresh)
export const startDashboardBroadcast = (io, intervalMinutes = 5) => {
  setInterval(async () => {
    try {
      const stats = await getDashboardStats();
      io.to("admin-dashboard").emit("dashboardStats", stats);
      console.log(`🔄 Auto-broadcast dashboard stats at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error("Auto-broadcast error:", error);
    }
  }, intervalMinutes * 60 * 1000);
};