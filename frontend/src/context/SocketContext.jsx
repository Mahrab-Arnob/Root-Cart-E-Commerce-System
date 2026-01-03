import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
  });

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
      
      // Join admin dashboard if needed
      socketInstance.emit("adminJoin");
    });

    socketInstance.on("dashboardStats", (data) => {
      console.log("📊 Received dashboard stats:", data);
      if (data && data.success) {
        setDashboardStats(data.data);
      } else if (data) {
        // Handle direct data (without success wrapper)
        setDashboardStats(data);
      }
    });

    socketInstance.on("newOrderNotification", (notification) => {
      console.log("🛒 New order notification:", notification);
      // You can show a toast notification here
      if (notification.stats) {
        setDashboardStats(notification.stats);
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error.message);
      setIsConnected(false);
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected on attempt:", attemptNumber);
      setIsConnected(true);
      socketInstance.emit("adminJoin");
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("🧹 Socket disconnected on cleanup");
      }
    };
  }, []);

  // Function to manually join admin dashboard
  const joinAdminDashboard = () => {
    if (socket && isConnected) {
      socket.emit("adminJoin");
      console.log("👑 Emitted adminJoin");
    }
  };

  // Function to manually request stats
  const refreshStats = () => {
    if (socket && isConnected) {
      socket.emit("getDashboardStats");
      console.log("🔄 Requested stats refresh");
    }
  };

  const value = {
    socket,
    isConnected,
    dashboardStats,
    joinAdminDashboard,
    refreshStats,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};