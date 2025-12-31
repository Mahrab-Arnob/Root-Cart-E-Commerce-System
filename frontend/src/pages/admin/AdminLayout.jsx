import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Grid3X3,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  ShoppingCart,
  X,
  LogOut,
  User,
  Home,
  ChevronRight,
  ChevronLeft,
 
  Bell
} from "lucide-react";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { setAdmin, navigate, axios, admin } = useContext(AppContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/admin/add-category", name: "Add Category", icon: Plus },
    { path: "/admin/add-product", name: "Add Product", icon: Package },
    { path: "/admin/categories", name: "All Categories", icon: Grid3X3 },
    { path: "/admin/products", name: "All Products", icon: Grid3X3 },
    { path: "/admin/orders", name: "Orders", icon: ShoppingCart },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/admin/logout");
      if (data.success) {
        toast.success(data.message);
        setAdmin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const getPageTitle = () => {
    const item = menuItems.find((item) => isActive(item.path, item.exact));
    return item?.name || "Admin Panel";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-primary text-white shadow-lg hover:bg-secondary transition-all"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 lg:w-20 xl:w-64
          transform transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-20' : ''}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col bg-gradient-to-b from-primary to-secondary text-white
          shadow-2xl
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10">
          <div className={`flex items-center space-x-3 ${collapsed ? 'lg:hidden xl:flex' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <LayoutDashboard size={22} />
            </div>
            <div className={`${collapsed ? 'lg:hidden xl:block' : ''}`}>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-white/70">Management System</p>
            </div>
          </div>
          
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-2 xl:px-3 py-4 lg:py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 lg:px-2 xl:px-3 py-3 lg:py-2 xl:py-3 
                  rounded-xl transition-all duration-200 group
                  ${active 
                    ? "bg-white text-primary shadow-lg" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                  ${collapsed ? 'lg:justify-center xl:justify-start' : ''}
                `}
                title={collapsed ? item.name : ""}
              >
                <Icon 
                  size={22} 
                  className={`
                    ${collapsed ? 'lg:mx-auto xl:mr-3' : 'mr-3'}
                    ${active ? 'text-primary' : 'group-hover:text-white'}
                  `} 
                />
                <span className={`
                  font-medium whitespace-nowrap
                  ${collapsed ? 'lg:hidden xl:inline' : ''}
                `}>
                  {item.name}
                </span>
                
                {/* Active indicator */}
                {active && !collapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 lg:p-2 xl:p-3 border-t border-white/10">
          {/* User Info */}
          <div className={`flex items-center mb-3 ${collapsed ? 'lg:hidden xl:flex' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            <div className={`ml-3 ${collapsed ? 'lg:hidden xl:block' : ''}`}>
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-white/60 truncate">admin@example.com</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className={`
              flex items-center w-full px-3 lg:px-2 xl:px-3 py-2.5 lg:py-2 xl:py-2.5
              rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white
              transition-all duration-200 group
              ${collapsed ? 'lg:justify-center xl:justify-start' : ''}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut 
              size={20} 
              className={`
                ${collapsed ? 'lg:mx-auto xl:mr-3' : 'mr-3'}
                group-hover:rotate-12 transition-transform
              `} 
            />
            <span className={`
              font-medium whitespace-nowrap
              ${collapsed ? 'lg:hidden xl:inline' : ''}
            `}>
              Logout
            </span>
          </button>

          {/* Quick Links */}
          <div className={`mt-3 ${collapsed ? 'lg:hidden xl:block' : ''}`}>
            <div className="flex justify-between text-xs text-white/60">
              <Link to="/" className="hover:text-white transition-colors flex items-center">
                <Home size={12} className="mr-1" />
                Home
              </Link>
              <span className="mx-2">•</span>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            {/* Left side: Page title and breadcrumb */}
            <div className="flex items-center">
              {/* Breadcrumb for mobile */}
              <div className="md:hidden flex items-center text-sm text-gray-500">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-2 p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-gray-400">/</span>
                <span className="ml-2 font-medium text-gray-700">{getPageTitle()}</span>
              </div>
              
              {/* Page title for desktop */}
              <div className="hidden md:block">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {getPageTitle()}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, Admin
                </p>
              </div>
            </div>

            {/* Right side: Notifications and user actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <p className="text-sm text-gray-500">You have 3 new notifications</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* Notification items */}
                      <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-500 mt-1">Order #1234 just came in</p>
                      </div>
                    </div>
                    <div className="p-2 border-t">
                      <button className="w-full text-sm text-primary hover:bg-gray-50 p-2 rounded">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User profile dropdown for desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
              </div>

              {/* Logout button for mobile */}
              <button
                onClick={logout}
                className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile quick stats */}
          <div className="md:hidden border-t border-gray-200">
            <div className="flex justify-around py-2">
              <div className="text-center">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="text-sm font-bold">12</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Products</p>
                <p className="text-sm font-bold">45</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Today</p>
                <p className="text-sm font-bold">৳ 1,234</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            {/* Mobile page header */}
            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your store from your mobile device
              </p>
            </div>
            
            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <Outlet />
            </div>

            {/* Mobile bottom navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
              <div className="flex justify-around py-3">
                <button
                  onClick={() => navigate("/admin")}
                  className={`flex flex-col items-center p-2 ${
                    location.pathname === "/admin" 
                      ? "text-primary" 
                      : "text-gray-500"
                  }`}
                >
                  <LayoutDashboard size={20} />
                  <span className="text-xs mt-1">Dashboard</span>
                </button>
                <button
                  onClick={() => navigate("/admin/products")}
                  className={`flex flex-col items-center p-2 ${
                    location.pathname.includes("/products") 
                      ? "text-primary" 
                      : "text-gray-500"
                  }`}
                >
                  <Package size={20} />
                  <span className="text-xs mt-1">Products</span>
                </button>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className={`flex flex-col items-center p-2 ${
                    location.pathname.includes("/orders") 
                      ? "text-primary" 
                      : "text-gray-500"
                  }`}
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs mt-1">Orders</span>
                </button>
                <button
                  onClick={() => navigate("/admin/categories")}
                  className={`flex flex-col items-center p-2 ${
                    location.pathname.includes("/categories") 
                      ? "text-primary" 
                      : "text-gray500"
                  }`}
                >
                  <Grid3X3 size={20} />
                  <span className="text-xs mt-1">Categories</span>
                </button>
              </div>
            </div>

            {/* Mobile content padding for bottom nav */}
            <div className="md:hidden h-16"></div>
          </div>
        </main>

        {/* Footer */}
        <footer className="hidden md:block bg-white border-t py-4 px-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              © {new Date().getFullYear()} Admin Panel. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <button className="hover:text-primary transition-colors">Help</button>
              <button className="hover:text-primary transition-colors">Privacy</button>
              <button className="hover:text-primary transition-colors">Terms</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;