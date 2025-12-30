import Order from "../models/order.model.js";
import { io, getDashboardStats } from "../index.js"; // Import from your main file

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { items, address, totalAmount, paymentMethod } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    const formattedItems = items.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      price: item.offerPrice || item.price,
    }));

    const order = await Order.create({
      user: id,
      items: formattedItems,
      address,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      status: "Pending",
    });

    // 🔥 REAL-TIME: Emit new order event
    if (io) {
      try {
        const stats = await getDashboardStats();
        
        // Emit to admin dashboard
        io.to("admin-dashboard").emit("newOrder", {
          orderId: order._id,
          orderNumber: `ORD-${Date.now()}`,
          customer: req.user.name || req.user.email,
          totalAmount: order.totalAmount,
          itemsCount: order.items.length,
          status: order.status,
          timestamp: new Date(),
          stats: stats,
        });
        
        // Also send updated dashboard stats
        io.to("admin-dashboard").emit("dashboardStats", stats);
        
        console.log(`📦 Socket: New order ${order._id} emitted`);
      } catch (socketError) {
        console.error("Socket emit error:", socketError);
        // Don't fail the order if socket fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id })
      .populate("items.product", "name price image")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .populate("address")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 🔥 REAL-TIME: Emit order status update
    if (io) {
      try {
        const stats = await getDashboardStats();
        
        // Emit to admin dashboard
        io.to("admin-dashboard").emit("orderStatusUpdated", {
          orderId: order._id,
          orderNumber: `ORD-${order._id.toString().slice(-6)}`,
          newStatus: status,
          customer: order.user?.name || order.user?.email,
          previousStatus: order.status,
          timestamp: new Date(),
        });
        
        // Emit updated dashboard stats
        io.to("admin-dashboard").emit("dashboardStats", stats);
        
        // Emit to user's room if they're connected
        if (order.user) {
          io.to(`user-${order.user._id}`).emit("orderUpdate", {
            orderId: order._id,
            status: status,
            message: `Your order status has been updated to: ${status}`,
          });
        }
        
        console.log(`🔄 Socket: Order ${orderId} status updated to ${status}`);
      } catch (socketError) {
        console.error("Socket emit error:", socketError);
      }
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get order stats error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};