import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, DollarSign, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

const Dashboard = () => {
  const { socket, isConnected, dashboardStats } = useSocket();
  const [stats, setStats] = useState({
    totalProducts: 2847,
    totalCustomers: 18432,
    totalOrders: 9251,
    totalRevenue: 432890,
  });
  const [loading, setLoading] = useState(false);

  // Fetch data from API if socket is not connected
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/dashboard/stats");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Update stats when socket data changes
  useEffect(() => {
    if (dashboardStats) {
      setStats(dashboardStats);
    }
  }, [dashboardStats]);

  // Fetch initial data
  useEffect(() => {
    if (!isConnected) {
      fetchDashboardData();
    }
  }, [isConnected]);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            {isConnected ? "Real-time updates active" : "Fetching static data"}
          </p>
        </div>

        {/* Connection Status Indicator */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          isConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {isConnected ? (
            <>
              <Wifi size={20} />
              <span className="font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff size={20} />
              <span className="font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  <Icon size={24} className={item.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Status Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full animate-pulse ${
                isConnected ? "bg-green-500" : "bg-yellow-500"
              }`}></div>
              <div>
                <p className="font-medium text-gray-900">
                  Backend Connection
                </p>
                <p className="text-sm text-gray-600">
                  {isConnected 
                    ? "Connected to real-time server" 
                    : "Using static data. Ensure backend is running at http://localhost:4000"}
                </p>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {isConnected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <span className="font-medium">✅ Real-time mode:</span> Dashboard will automatically update when new orders are placed.
              </p>
            </div>
          )}

          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <span className="font-medium">⚠️ Offline mode:</span> Connect to backend for real-time updates.
                <br />
                <span className="text-sm">
                  Make sure your backend server is running:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">npm run server</code>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;