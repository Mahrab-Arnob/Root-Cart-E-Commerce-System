import { useState, useEffect, useRef } from "react";
import { Package, ShoppingCart, Users, DollarSign, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const Dashboard = () => {
  const { socket, isConnected, dashboardStats, refreshStats } = useSocket();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Track if this is initial mount
  const initialMount = useRef(true);

  // Fetch data from API if socket is not connected
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("http://localhost:4000/api/dashboard/stats");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
          setLastUpdated(new Date());
          console.log("✅ Fetched dashboard data via API");
        }
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Update stats when socket data changes
  useEffect(() => {
    if (dashboardStats && Object.keys(dashboardStats).length > 0) {
      setStats(dashboardStats);
      setLastUpdated(new Date());
      if (loading) setLoading(false);
    }
  }, [dashboardStats]);

  // Fetch initial data on mount
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      
      if (!isConnected) {
        // If socket not connected, fetch via API
        fetchDashboardData();
      } else {
        // If connected, socket will provide data
        setLoading(false);
      }
      
      // Set up interval for API fallback refresh (every 60 seconds)
      const interval = setInterval(() => {
        if (!isConnected) {
          fetchDashboardData();
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Handle manual refresh
  const handleRefresh = () => {
    if (isConnected) {
      refreshStats();
    } else {
      fetchDashboardData();
    }
  };

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts?.toLocaleString() || "0",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers?.toLocaleString() || "0",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8.2%",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders?.toLocaleString() || "0",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+24.1%",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "+18.7%",
      trend: "up",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders?.toLocaleString() || "0",
      icon: ShoppingCart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "Today",
      trend: "neutral",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders?.toLocaleString() || "0",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Requires action",
      trend: "warning",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">
            {isConnected ? "Connecting to real-time server..." : "Fetching from API..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            {isConnected 
              ? "Real-time updates are active" 
              : "Using API data. Connect to backend for real-time updates."}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            isConnected 
              ? "border-green-200 bg-green-50 text-green-800" 
              : "border-yellow-200 bg-yellow-50 text-yellow-800"
          }`}>
            {isConnected ? (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <Wifi size={18} />
                <span className="font-medium">Live</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <WifiOff size={18} />
                <span className="font-medium">Offline</span>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  <Icon size={24} className={item.color} />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  item.trend === 'up' ? 'bg-green-100 text-green-800' :
                  item.trend === 'warning' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h3>
              </div>
              {index === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {isConnected ? "Real-time update" : "Manual update"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Connection Details Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Connection Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Socket Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">Socket.io Connection</p>
                  <p className="text-sm text-gray-600">WebSocket real-time updates</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isConnected ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Endpoint:</span> ws://localhost:4000
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                {isConnected 
                  ? 'Connected to real-time server. Dashboard updates automatically.' 
                  : 'Not connected. Using periodic API calls.'}
              </p>
            </div>
          </div>

          {/* API Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium text-gray-900">REST API Connection</p>
                  <p className="text-sm text-gray-600">HTTP data fetching</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Endpoint:</span> http://localhost:4000/api/dashboard/stats
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Status:</span> Always available as fallback when socket is disconnected.
              </p>
            </div>
          </div>
        </div>

        {/* Connection Instructions */}
        {!isConnected && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Connection Required</h3>
            <p className="text-sm text-yellow-700 mb-3">
              To enable real-time updates, make sure your backend server is running:
            </p>
            <div className="bg-black text-white p-3 rounded-lg font-mono text-sm">
              <code>cd backend && npm run server</code>
            </div>
            <p className="text-xs text-yellow-700 mt-3">
              The dashboard will automatically switch to real-time mode when the backend is detected.
            </p>
          </div>
        )}

        {isConnected && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">✅ Real-time Mode Active</h3>
            <p className="text-sm text-green-700">
              Dashboard is receiving live updates via WebSocket. New orders, product updates, and statistics will appear instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;