const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { getDashboardStats } = require('../server'); // Or wherever your server file is

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image');
    
    res.status(200).json({
      success: true,
      data: recentOrders
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders'
    });
  }
};

// Get sales analytics (last 30 days)
exports.getSalesAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['delivered', 'completed', 'paid'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: dailySales
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics'
    });
  }
};