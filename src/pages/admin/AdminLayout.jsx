import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Grid3X3,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { setAdmin, navigate, axios } = useContext(AppContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    return location.pathname === path;
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
      toast.error(error.message);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 ">
        <button className="p-2 rounded-md bg-white hover:bg-gray-50 transition-colors">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary text-white">
            <h1>Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-blue-100 text-primary border-r-4 border-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3">
                <div>
                  <div className="font-medium text-gray-800">Admin User</div>
                  <div>admin@example.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black  bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}

        <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-0 pl-16">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path, item.exact))
                ?.name || "Admin Panel"}
            </h2>
            <div className="hidden md:flex items-center spaxe-x-4">
              <div className="text-sm text-gray-500">
                <p
                  onClick={logout}
                  className="cursor-pointer hover:underline text-red-500 text-lg font-semibold"
                >
                  logout
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;